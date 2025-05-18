import { db, schema } from '../db';
import { eq, desc, like, and } from 'drizzle-orm';

export class TagService {
  // 获取所有标签
  async getTags(page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const tags = await db
      .select()
      .from(schema.tags)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.tags.count));

    // 获取总标签数
    const countResult = await db
      .select({ count: db.fn.count() })
      .from(schema.tags)
      .get();

    const totalTags = countResult?.count || 0;
    const totalPages = Math.ceil(totalTags / limit);

    return {
      tags,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalTags,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  // 通过ID获取标签
  async getTagById(id: string) {
    const tag = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.id, id))
      .get();

    return tag;
  }

  // 获取标签的关注者数量
  async getTagFollowerCount(tagId: string) {
    const countResult = await db
      .select({ count: db.fn.count() })
      .from(schema.userInteractions)
      .where(
        and(
          eq(schema.userInteractions.targetType, 'tag'),
          eq(schema.userInteractions.targetId, tagId),
          eq(schema.userInteractions.type, 'follow')
        )
      )
      .get();

    return countResult?.count || 0;
  }

  // 获取热门标签
  async getPopularTags(limit = 10) {
    return db
      .select()
      .from(schema.tags)
      .orderBy(desc(schema.tags.count))
      .limit(limit);
  }

  // 搜索标签
  async searchTags(query: string, limit = 10) {
    return db
      .select()
      .from(schema.tags)
      .where(like(schema.tags.name, `%${query}%`))
      .orderBy(desc(schema.tags.count))
      .limit(limit);
  }

  // 获取相关标签（简单实现：根据使用频率获取）
  async getRelatedTags(tagId: string, limit = 5) {
    // 先获取当前标签相关的问题IDs
    const questionIds = await db
      .select({ questionId: schema.questionTags.questionId })
      .from(schema.questionTags)
      .where(eq(schema.questionTags.tagId, tagId));

    if (questionIds.length === 0) {
      return this.getPopularTags(limit);
    }

    // 获取这些问题中使用的其他标签（排除当前标签）
    const relatedTagIds = await db
      .select({
        tagId: schema.questionTags.tagId,
        count: db.fn.count()
      })
      .from(schema.questionTags)
      .where(
        and(
          schema.questionTags.questionId.in(questionIds.map(q => q.questionId)),
          schema.questionTags.tagId.ne(tagId)
        )
      )
      .groupBy(schema.questionTags.tagId)
      .orderBy(desc(sql`count`))
      .limit(limit);

    if (relatedTagIds.length === 0) {
      return this.getPopularTags(limit);
    }

    // 获取标签详情
    return db
      .select()
      .from(schema.tags)
      .where(schema.tags.id.in(relatedTagIds.map(t => t.tagId)));
  }
}
