import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';

type UserWithStats = schema.User & {
  stats: {
    questions: number;
    answers: number;
    followers: number;
  }
};

export class UserService {
  // 获取所有用户
  async getUsers() {
    return db.select().from(schema.users);
  }

  // 通过ID获取用户
  async getUserById(id: string): Promise<UserWithStats | null> {
    const user = await db.select().from(schema.users).where(eq(schema.users.id, id)).get();

    if (!user) return null;

    // 获取该用户的问题数量
    const questionCount = await db
      .select({ count: db.fn.count() })
      .from(schema.questions)
      .where(eq(schema.questions.authorId, id))
      .get();

    // 获取该用户的回答数量
    const answerCount = await db
      .select({ count: db.fn.count() })
      .from(schema.answers)
      .where(eq(schema.answers.authorId, id))
      .get();

    // 获取该用户的关注者数量（通过user_interactions表）
    const followerCount = await db
      .select({ count: db.fn.count() })
      .from(schema.userInteractions)
      .where(
        and(
          eq(schema.userInteractions.targetType, 'user'),
          eq(schema.userInteractions.targetId, id),
          eq(schema.userInteractions.type, 'follow')
        )
      )
      .get();

    return {
      ...user,
      stats: {
        questions: questionCount?.count || 0,
        answers: answerCount?.count || 0,
        followers: followerCount?.count || 0
      }
    };
  }

  // 获取用户活动
  async getUserActivities(userId: string) {
    return db
      .select()
      .from(schema.userActivities)
      .where(eq(schema.userActivities.userId, userId))
      .orderBy(schema.userActivities.date, 'desc');
  }

  // 获取用户的标签
  async getUserTags(userId: string) {
    return db
      .select({
        id: schema.tags.id,
        name: schema.tags.name
      })
      .from(schema.userTags)
      .innerJoin(schema.tags, eq(schema.userTags.tagId, schema.tags.id))
      .where(eq(schema.userTags.userId, userId));
  }

  // 检查用户是否关注了某个标签
  async isTagFollowed(userId: string, tagId: string): Promise<boolean> {
    const record = await db
      .select()
      .from(schema.userInteractions)
      .where(
        and(
          eq(schema.userInteractions.userId, userId),
          eq(schema.userInteractions.targetType, 'tag'),
          eq(schema.userInteractions.targetId, tagId),
          eq(schema.userInteractions.type, 'follow')
        )
      )
      .get();

    return !!record;
  }

  // 关注标签
  async followTag(userId: string, tagId: string) {
    const isFollowed = await this.isTagFollowed(userId, tagId);

    if (isFollowed) {
      return { success: false, message: 'Already following this tag' };
    }

    await db.insert(schema.userInteractions).values({
      userId,
      targetType: 'tag',
      targetId: tagId,
      type: 'follow',
      value: 1,
      createdAt: new Date().toISOString()
    });

    return { success: true };
  }

  // 取消关注标签
  async unfollowTag(userId: string, tagId: string) {
    const isFollowed = await this.isTagFollowed(userId, tagId);

    if (!isFollowed) {
      return { success: false, message: 'Not following this tag' };
    }

    await db
      .delete(schema.userInteractions)
      .where(
        and(
          eq(schema.userInteractions.userId, userId),
          eq(schema.userInteractions.targetType, 'tag'),
          eq(schema.userInteractions.targetId, tagId),
          eq(schema.userInteractions.type, 'follow')
        )
      );

    return { success: true };
  }
}
