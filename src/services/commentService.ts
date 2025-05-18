import { db, schema } from '../db';
import { eq, and, desc, asc, isNull } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export class CommentService {
  // 生成评论ID
  private generateCommentId(): string {
    return `c_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
  }

  // 获取指定目标的所有评论
  async getCommentsByTarget(targetType: 'question' | 'answer', targetId: string) {
    // 获取所有顶级评论（parentId 为 null 的）
    const topLevelComments = await db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        },
        targetType: schema.comments.targetType,
        targetId: schema.comments.targetId,
        parentId: schema.comments.parentId,
        votes: schema.comments.votes,
        createdAt: schema.comments.createdAt,
        updatedAt: schema.comments.updatedAt
      })
      .from(schema.comments)
      .innerJoin(schema.users, eq(schema.comments.authorId, schema.users.id))
      .where(
        and(
          eq(schema.comments.targetType, targetType),
          eq(schema.comments.targetId, targetId),
          isNull(schema.comments.parentId)
        )
      )
      .orderBy(desc(schema.comments.createdAt));

    // 获取所有回复评论
    const allReplies = await db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        },
        targetType: schema.comments.targetType,
        targetId: schema.comments.targetId,
        parentId: schema.comments.parentId,
        votes: schema.comments.votes,
        createdAt: schema.comments.createdAt,
        updatedAt: schema.comments.updatedAt
      })
      .from(schema.comments)
      .innerJoin(schema.users, eq(schema.comments.authorId, schema.users.id))
      .where(
        and(
          eq(schema.comments.targetType, targetType),
          eq(schema.comments.targetId, targetId),
          // 不为null的所有评论
          schema.comments.parentId.isNotNull()
        )
      )
      .orderBy(asc(schema.comments.createdAt));

    // 将回复归类到其父评论下
    const commentTree = topLevelComments.map(comment => {
      const replies = allReplies.filter(reply => reply.parentId === comment.id);
      return {
        ...comment,
        replies: replies || []
      };
    });

    return commentTree;
  }

  // 创建评论
  async createComment(authorId: string, targetType: 'question' | 'answer', targetId: string, content: string, parentId?: string) {
    const commentId = this.generateCommentId();

    await db.insert(schema.comments).values({
      id: commentId,
      content,
      authorId,
      targetType,
      targetId,
      parentId: parentId || null,
      createdAt: new Date().toISOString(),
    });

    // 返回新创建的评论
    return this.getCommentById(commentId);
  }

  // 通过ID获取评论
  async getCommentById(id: string) {
    const comment = await db
      .select({
        id: schema.comments.id,
        content: schema.comments.content,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        },
        targetType: schema.comments.targetType,
        targetId: schema.comments.targetId,
        parentId: schema.comments.parentId,
        votes: schema.comments.votes,
        createdAt: schema.comments.createdAt,
        updatedAt: schema.comments.updatedAt
      })
      .from(schema.comments)
      .innerJoin(schema.users, eq(schema.comments.authorId, schema.users.id))
      .where(eq(schema.comments.id, id))
      .get();

    return comment;
  }

  // 更新评论
  async updateComment(id: string, content: string) {
    await db
      .update(schema.comments)
      .set({
        content,
        updatedAt: new Date().toISOString()
      })
      .where(eq(schema.comments.id, id));

    return this.getCommentById(id);
  }

  // 删除评论
  async deleteComment(id: string) {
    const result = await db
      .delete(schema.comments)
      .where(eq(schema.comments.id, id))
      .returning({ deletedId: schema.comments.id });

    return result.length > 0;
  }

  // 投票评论
  async voteComment(id: string, value: number) {
    await db
      .update(schema.comments)
      .set({
        votes: db.sql`${schema.comments.votes} + ${value}`
      })
      .where(eq(schema.comments.id, id));

    return this.getCommentById(id);
  }
}
