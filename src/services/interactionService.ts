import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';

export class InteractionService {
  // 用户点赞/踩
  async vote(userId: string, targetType: 'question' | 'answer', targetId: string, value: 1 | -1) {
    // 检查是否已经投票
    const existingVote = await db
      .select()
      .from(schema.userInteractions)
      .where(
        and(
          eq(schema.userInteractions.userId, userId),
          eq(schema.userInteractions.targetType, targetType),
          eq(schema.userInteractions.targetId, targetId),
          eq(schema.userInteractions.type, 'vote')
        )
      )
      .get();

    // 如果已经存在相同的投票，则取消投票
    if (existingVote && existingVote.value === value) {
      await db
        .delete(schema.userInteractions)
        .where(eq(schema.userInteractions.id, existingVote.id));

      // 更新目标的投票数
      if (targetType === 'question') {
        await db
          .update(schema.questions)
          .set({ votes: db.sql`${schema.questions.votes} - ${value}` })
          .where(eq(schema.questions.id, targetId));
      } else {
        await db
          .update(schema.answers)
          .set({ votes: db.sql`${schema.answers.votes} - ${value}` })
          .where(eq(schema.answers.id, targetId));
      }

      return { status: 'removed', value: 0 };
    }
    // 如果存在相反的投票，更新投票值
    else if (existingVote) {
      await db
        .update(schema.userInteractions)
        .set({ value, createdAt: new Date().toISOString() })
        .where(eq(schema.userInteractions.id, existingVote.id));

      // 更新目标的投票数 (由于是从-1到1或从1到-1，所以要加上2*value)
      if (targetType === 'question') {
        await db
          .update(schema.questions)
          .set({ votes: db.sql`${schema.questions.votes} + ${2 * value}` })
          .where(eq(schema.questions.id, targetId));
      } else {
        await db
          .update(schema.answers)
          .set({ votes: db.sql`${schema.answers.votes} + ${2 * value}` })
          .where(eq(schema.answers.id, targetId));
      }

      return { status: 'updated', value };
    }
    // 如果不存在投票，创建新投票
    else {
      await db.insert(schema.userInteractions).values({
        userId,
        type: 'vote',
        targetType,
        targetId,
        value,
        createdAt: new Date().toISOString()
      });

      // 更新目标的投票数
      if (targetType === 'question') {
        await db
          .update(schema.questions)
          .set({ votes: db.sql`${schema.questions.votes} + ${value}` })
          .where(eq(schema.questions.id, targetId));
      } else {
        await db
          .update(schema.answers)
          .set({ votes: db.sql`${schema.answers.votes} + ${value}` })
          .where(eq(schema.answers.id, targetId));
      }

      return { status: 'added', value };
    }
  }

  // 收藏问题
  async bookmark(userId: string, questionId: string) {
    // 检查是否已经收藏
    const existingBookmark = await db
      .select()
      .from(schema.userInteractions)
      .where(
        and(
          eq(schema.userInteractions.userId, userId),
          eq(schema.userInteractions.targetType, 'question'),
          eq(schema.userInteractions.targetId, questionId),
          eq(schema.userInteractions.type, 'bookmark')
        )
      )
      .get();

    if (existingBookmark) {
      // 取消收藏
      await db
        .delete(schema.userInteractions)
        .where(eq(schema.userInteractions.id, existingBookmark.id));
      return { status: 'removed' };
    } else {
      // 添加收藏
      await db.insert(schema.userInteractions).values({
        userId,
        type: 'bookmark',
        targetType: 'question',
        targetId: questionId,
        value: 1,
        createdAt: new Date().toISOString()
      });
      return { status: 'added' };
    }
  }

  // 举报内容
  async report(userId: string, targetType: 'question' | 'answer', targetId: string, reason: string, description?: string) {
    // 检查是否已经举报
    const existingReport = await db
      .select()
      .from(schema.userInteractions)
      .where(
        and(
          eq(schema.userInteractions.userId, userId),
          eq(schema.userInteractions.targetType, targetType),
          eq(schema.userInteractions.targetId, targetId),
          eq(schema.userInteractions.type, 'report')
        )
      )
      .get();

    if (existingReport) {
      // 更新举报信息
      await db
        .update(schema.userInteractions)
        .set({
          reason,
          description: description || null,
          createdAt: new Date().toISOString()
        })
        .where(eq(schema.userInteractions.id, existingReport.id));
      return { status: 'updated' };
    } else {
      // 添加举报
      await db.insert(schema.userInteractions).values({
        userId,
        type: 'report',
        targetType,
        targetId,
        value: 1,
        reason,
        description: description || null,
        createdAt: new Date().toISOString()
      });
      return { status: 'added' };
    }
  }

  // 获取用户互动状态
  async getUserInteractions(userId: string, targetType: string, targetId: string) {
    const interactions = await db
      .select()
      .from(schema.userInteractions)
      .where(
        and(
          eq(schema.userInteractions.userId, userId),
          eq(schema.userInteractions.targetType, targetType),
          eq(schema.userInteractions.targetId, targetId)
        )
      );

    // 将互动转换为更友好的格式
    const result: Record<string, any> = {
      voted: 0,
      bookmarked: false,
      reported: false
    };

    interactions.forEach(interaction => {
      if (interaction.type === 'vote') {
        result.voted = interaction.value;
      } else if (interaction.type === 'bookmark') {
        result.bookmarked = true;
      } else if (interaction.type === 'report') {
        result.reported = true;
        result.reportReason = interaction.reason;
      } else if (interaction.type === 'follow') {
        result.followed = true;
      }
    });

    return result;
  }
}
