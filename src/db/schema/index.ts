import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

// 用户表
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // 用户名作为ID
  name: text('name').notNull(),
  avatar: text('avatar').notNull(),
  reputation: integer('reputation').notNull().default(0),
  bio: text('bio'),
  createdAt: text('created_at').notNull(),
}, (table) => ({
  nameIdx: uniqueIndex('name_idx').on(table.name),
}));

// 标签表
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  count: integer('count').notNull().default(0),
}, (table) => ({
  nameIdx: uniqueIndex('tag_name_idx').on(table.name),
}));

// 用户标签关联表
export const userTags = sqliteTable('user_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (table) => ({
  userTagIdx: uniqueIndex('user_tag_idx').on(table.userId, table.tagId),
}));

// 问题表
export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(), // 使用自定义ID格式
  title: text('title').notNull(),
  content: text('content').notNull(),
  votes: integer('votes').notNull().default(0),
  answerCount: integer('answer_count').notNull().default(0),
  views: integer('views').notNull().default(0),
  authorId: text('author_id').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
  status: text('status').notNull().default('unanswered'), // unanswered, answered
  isSolved: integer('is_solved').notNull().default(0), // 0=false, 1=true
});

// 问题标签关联表
export const questionTags = sqliteTable('question_tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  questionId: text('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  tagId: text('tag_id').notNull().references(() => tags.id),
}, (table) => ({
  questionTagIdx: uniqueIndex('question_tag_idx').on(table.questionId, table.tagId),
}));

// 回答表
export const answers = sqliteTable('answers', {
  id: text('id').primaryKey(), // 使用自定义ID格式
  questionId: text('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  authorId: text('author_id').notNull().references(() => users.id),
  votes: integer('votes').notNull().default(0),
  createdAt: text('created_at').notNull(),
  isAccepted: integer('is_accepted').notNull().default(0), // 0=false, 1=true
});

// 用户活动表
export const userActivities = sqliteTable('user_activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // question, answer
  itemId: text('item_id').notNull(), // 问题或回答的ID
  questionId: text('question_id').notNull(), // 相关的问题ID
  questionTitle: text('question_title').notNull(), // 问题标题
  date: text('date').notNull(),
});

// 用户交互表：点赞、收藏、关注
export const userInteractions = sqliteTable('user_interactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // vote, bookmark, follow, report
  targetType: text('target_type').notNull(), // question, answer, user, tag
  targetId: text('target_id').notNull(), // 目标ID
  value: integer('value').notNull().default(1), // 用于投票的值 (1=upvote, -1=downvote) 或其他数值
  createdAt: text('created_at').notNull(),
  // 举报相关字段
  reason: text('reason'),
  description: text('description'),
}, (table) => ({
  userInteractionIdx: uniqueIndex('user_interaction_idx').on(
    table.userId, table.type, table.targetType, table.targetId
  ),
}));

// 评论表
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(), // 使用自定义ID格式
  content: text('content').notNull(),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: text('target_type').notNull(), // 'question' 或 'answer'
  targetId: text('target_id').notNull(),
  parentId: text('parent_id').references(() => comments.id, { onDelete: 'cascade' }),
  votes: integer('votes').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
});

// 模式导出
export type User = typeof users.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type UserTag = typeof userTags.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuestionTag = typeof questionTags.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
export type UserInteraction = typeof userInteractions.$inferSelect;
export type Comment = typeof comments.$inferSelect;
