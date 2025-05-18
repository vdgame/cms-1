import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';

export class AnswerService {
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
}
