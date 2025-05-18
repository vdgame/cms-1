import { existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { users as mockUsers, questions as mockQuestions, answers as mockAnswers, tags as mockTags } from '../data/mockData';

// 确保 data 目录存在
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dataDir = join(dirname(dirname(__dirname)), 'data');

if (!existsSync(dataDir)) {
  console.log(`Creating data directory: ${dataDir}`);
  mkdirSync(dataDir, { recursive: true });
}

// 数据库路径
const dbPath = join(dataDir, 'segmentfault.db');

// 对标签ID进行规范化处理
function normalizeTagId(tag: string | { id: string; name: string }): string {
  return typeof tag === 'string' ? tag : tag.id;
}

// 将问题中的字符串标签转换为标签ID
function prepareTagIds(db: Database, questions: any[]) {
  // 创建标签映射表 (标签名 -> 标签ID)
  const tagNameToId = new Map<string, string>();
  for (const tag of mockTags) {
    tagNameToId.set(tag.name, tag.id);
  }

  // 为问题中的标签找到或创建ID
  for (const question of questions) {
    const processedTags: string[] = [];

    for (let i = 0; i < question.tags.length; i++) {
      const tag = question.tags[i];

      if (typeof tag === 'string') {
        // 如果已经有对应ID，使用它
        if (tagNameToId.has(tag)) {
          processedTags.push(tagNameToId.get(tag)!);
        }
        // 否则创建一个新ID
        else {
          const tagId = tag.toLowerCase().replace(/\s+/g, '-');
          tagNameToId.set(tag, tagId);
          processedTags.push(tagId);

          // 确保标签存在于数据库中
          try {
            db.prepare('INSERT INTO tags (id, name, count) VALUES (?, ?, ?)').run(tagId, tag, 0);
          } catch (error) {
            // 可能已经存在，忽略错误
            console.log(`Note: Tag ID '${tagId}' for '${tag}' may already exist`);
          }
        }
      }
      // 已经是完整的标签对象
      else {
        processedTags.push(tag.id);
      }
    }

    // 更新问题的标签为处理后的ID
    question.tags = processedTags;
  }
}

// 确保所有作者存在
function ensureAuthorsExist(db: Database, authors: { id: string; name: string; avatar: string }[]) {
  const checkUser = db.prepare('SELECT id FROM users WHERE id = ?');
  const insertUser = db.prepare('INSERT INTO users (id, name, avatar, reputation, bio, created_at) VALUES (?, ?, ?, ?, ?, ?)');

  for (const author of authors) {
    const exists = checkUser.get(author.id);
    if (!exists) {
      console.log(`Creating missing author: ${author.id}`);
      insertUser.run(
        author.id,
        author.name,
        author.avatar,
        0, // 默认声望
        '', // 默认简介
        new Date().toISOString() // 当前时间
      );
    }
  }
}

async function seed() {
  console.log('Seeding database...');

  try {
    const db = new Database(dbPath);
    db.pragma('foreign_keys = ON');

    try {
      // 开始事务
      db.exec('BEGIN TRANSACTION;');

      // 清空表以重新开始
      console.log('Clearing existing data...');
      db.exec('DELETE FROM user_interactions;');
      db.exec('DELETE FROM user_activities;');
      db.exec('DELETE FROM answers;');
      db.exec('DELETE FROM question_tags;');
      db.exec('DELETE FROM questions;');
      db.exec('DELETE FROM user_tags;');
      db.exec('DELETE FROM tags;');
      db.exec('DELETE FROM users;');

      // 准备语句
      const insertTag = db.prepare('INSERT INTO tags (id, name, count) VALUES (?, ?, ?)');
      const insertUser = db.prepare('INSERT INTO users (id, name, avatar, reputation, bio, created_at) VALUES (?, ?, ?, ?, ?, ?)');
      const insertUserTag = db.prepare('INSERT INTO user_tags (user_id, tag_id) VALUES (?, ?)');
      const insertQuestion = db.prepare('INSERT INTO questions (id, title, content, votes, answer_count, views, author_id, created_at, status, is_solved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      const insertQuestionTag = db.prepare('INSERT INTO question_tags (question_id, tag_id) VALUES (?, ?)');
      const insertAnswer = db.prepare('INSERT INTO answers (id, question_id, content, author_id, votes, created_at, is_accepted) VALUES (?, ?, ?, ?, ?, ?, ?)');
      const insertActivity = db.prepare('INSERT INTO user_activities (user_id, type, item_id, question_id, question_title, date) VALUES (?, ?, ?, ?, ?, ?)');

      // 插入标签
      console.log('Inserting tags...');
      for (const tag of mockTags) {
        insertTag.run(tag.id, tag.name, tag.count);
      }

      // 处理问题中的标签
      console.log('Processing question tags...');
      prepareTagIds(db, mockQuestions);

      // 收集所有作者（包括回答中的作者）
      const authors = new Set<string>();

      // 收集问题作者
      mockQuestions.forEach(q => authors.add(q.author.id));

      // 收集回答作者
      const answerAuthors = mockAnswers.map(a => a.author);

      // 插入用户
      console.log('Inserting users...');
      for (const user of mockUsers) {
        insertUser.run(
          user.id,
          user.name,
          user.avatar,
          user.reputation,
          user.bio,
          user.createdAt
        );

        // 插入用户标签
        for (const tag of user.tags) {
          insertUserTag.run(user.id, tag.id);
        }
      }

      // 确保所有回答作者都存在
      console.log('Ensuring answer authors exist...');
      ensureAuthorsExist(db, answerAuthors);

      // 插入问题
      console.log('Inserting questions...');
      for (const question of mockQuestions) {
        insertQuestion.run(
          question.id,
          question.title,
          question.content,
          question.votes,
          question.answers,
          question.views,
          question.author.id,
          question.createdAt,
          question.status,
          question.isSolved ? 1 : 0
        );

        // 插入问题标签
        for (const tagId of question.tags) {
          insertQuestionTag.run(question.id, tagId);
        }
      }

      // 插入回答
      console.log('Inserting answers...');
      for (const answer of mockAnswers) {
        insertAnswer.run(
          answer.id,
          answer.questionId,
          answer.content,
          answer.author.id,
          answer.votes,
          answer.createdAt,
          answer.isAccepted ? 1 : 0
        );
      }

      // 插入用户活动
      console.log('Inserting user activities...');
      for (const user of mockUsers) {
        for (const activity of user.activities) {
          insertActivity.run(
            user.id,
            activity.type,
            activity.id,
            activity.questionId || activity.id,
            activity.questionTitle || '',
            activity.date
          );
        }
      }

      // 提交事务
      db.exec('COMMIT;');
      console.log('Seeding completed successfully!');
    } catch (error) {
      // 回滚事务
      db.exec('ROLLBACK;');
      throw error;
    } finally {
      // 关闭数据库连接
      db.close();
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// 运行种子函数
seed();
