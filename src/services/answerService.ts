import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export class AnswerService {
  // 生成回答ID
  private generateAnswerId(): string {
    return `a_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
  }

  // 获取问题的所有回答
  async getAnswersByQuestionId(questionId: string) {
    const answers = await db
      .select({
        id: schema.answers.id,
        content: schema.answers.content,
        votes: schema.answers.votes,
        createdAt: schema.answers.createdAt,
        isAccepted: schema.answers.isAccepted,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        }
      })
      .from(schema.answers)
      .innerJoin(schema.users, eq(schema.answers.authorId, schema.users.id))
      .where(eq(schema.answers.questionId, questionId))
      .orderBy(({ isAccepted }) => isAccepted, 'desc')
      .orderBy(({ votes }) => votes, 'desc')
      .orderBy(({ createdAt }) => createdAt, 'desc');

    return answers;
  }

  // 通过ID获取回答
  async getAnswerById(id: string) {
    const answer = await db
      .select({
        id: schema.answers.id,
        questionId: schema.answers.questionId,
        content: schema.answers.content,
        votes: schema.answers.votes,
        createdAt: schema.answers.createdAt,
        isAccepted: schema.answers.isAccepted,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        }
      })
      .from(schema.answers)
      .innerJoin(schema.users, eq(schema.answers.authorId, schema.users.id))
      .where(eq(schema.answers.id, id))
      .get();

    return answer;
  }

  // 创建回答
  async createAnswer(questionId: string, content: string, authorId: string) {
    const answerId = this.generateAnswerId();
    const createdAt = new Date().toISOString();

    // 创建回答
    await db.insert(schema.answers).values({
      id: answerId,
      questionId,
      content,
      authorId,
      createdAt
    });

    // 增加问题的回答计数
    await db
      .update(schema.questions)
      .set({
        answerCount: db.sql`${schema.questions.answerCount} + 1`,
        status: 'answered'
      })
      .where(eq(schema.questions.id, questionId));

    // 添加到用户活动
    const question = await db
      .select({ title: schema.questions.title })
      .from(schema.questions)
      .where(eq(schema.questions.id, questionId))
      .get();

    await db.insert(schema.userActivities).values({
      userId: authorId,
      type: 'answer',
      itemId: answerId,
      questionId,
      questionTitle: question?.title || '',
      date: createdAt
    });

    return this.getAnswerById(answerId);
  }

  // 更新回答
  async updateAnswer(id: string, content: string) {
    await db
      .update(schema.answers)
      .set({ content })
      .where(eq(schema.answers.id, id));

    return this.getAnswerById(id);
  }

  // 删除回答
  async deleteAnswer(id: string) {
    try {
      // 获取回答信息
      const answer = await this.getAnswerById(id);
      if (!answer) return false;

      // 删除回答
      const result = await db
        .delete(schema.answers)
        .where(eq(schema.answers.id, id))
        .returning({ deletedId: schema.answers.id });

      if (result.length > 0) {
        // 减少问题的回答计数
        await db
          .update(schema.questions)
          .set({
            answerCount: db.sql`${schema.questions.answerCount} - 1`
          })
          .where(eq(schema.questions.id, answer.questionId));

        // 如果删除的是已采纳的回答，需要将问题标记为未解决
        if (answer.isAccepted === 1) {
          await db
            .update(schema.questions)
            .set({
              isSolved: 0,
              status: 'answered'
            })
            .where(eq(schema.questions.id, answer.questionId));
        }

        // 检查问题是否还有回答
        const remainingAnswers = await db
          .select({ count: db.sql`COUNT(*)`.mapWith(Number).as('count') })
          .from(schema.answers)
          .where(eq(schema.answers.questionId, answer.questionId))
          .get();

        // 如果没有回答了，将问题标记为未回答
        if (remainingAnswers?.count === 0) {
          await db
            .update(schema.questions)
            .set({ status: 'unanswered' })
            .where(eq(schema.questions.id, answer.questionId));
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting answer:', error);
      return false;
    }
  }

  // 标记为最佳回答
  async markAsAccepted(id: string, questionId: string) {
    // 先重置该问题所有回答的接受状态
    await db
      .update(schema.answers)
      .set({ isAccepted: 0 })
      .where(eq(schema.answers.questionId, questionId));

    // 设置当前回答为已采纳
    await db
      .update(schema.answers)
      .set({ isAccepted: 1 })
      .where(eq(schema.answers.id, id));

    // 将问题标记为已解决
    await db
      .update(schema.questions)
      .set({
        isSolved: 1,
        status: 'answered'
      })
      .where(eq(schema.questions.id, questionId));

    return this.getAnswerById(id);
  }
}
