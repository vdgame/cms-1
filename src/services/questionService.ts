import { db, schema } from '../db';
import { eq, and, inArray, like, desc, sql } from 'drizzle-orm';

export class QuestionService {
  // 获取所有问题
  async getQuestions(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const questions = await db
      .select({
        id: schema.questions.id,
        title: schema.questions.title,
        content: schema.questions.content,
        votes: schema.questions.votes,
        answers: schema.questions.answerCount,
        views: schema.questions.views,
        status: schema.questions.status,
        isSolved: schema.questions.isSolved,
        createdAt: schema.questions.createdAt,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        }
      })
      .from(schema.questions)
      .innerJoin(schema.users, eq(schema.questions.authorId, schema.users.id))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.questions.createdAt));

    // 获取总问题数
    const countResult = await db
      .select({ count: db.fn.count() })
      .from(schema.questions)
      .get();

    const totalQuestions = countResult?.count || 0;
    const totalPages = Math.ceil(totalQuestions / limit);

    // 为每个问题获取标签
    const questionsWithTags = await Promise.all(
      questions.map(async (question) => {
        const tags = await this.getQuestionTags(question.id);
        return {
          ...question,
          tags: tags.map(tag => tag.name)
        };
      })
    );

    return {
      questions: questionsWithTags,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalQuestions,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  // 通过ID获取问题
  async getQuestionById(id: string) {
    const question = await db
      .select({
        id: schema.questions.id,
        title: schema.questions.title,
        content: schema.questions.content,
        votes: schema.questions.votes,
        answers: schema.questions.answerCount,
        views: schema.questions.views,
        status: schema.questions.status,
        isSolved: schema.questions.isSolved,
        createdAt: schema.questions.createdAt,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        }
      })
      .from(schema.questions)
      .innerJoin(schema.users, eq(schema.questions.authorId, schema.users.id))
      .where(eq(schema.questions.id, id))
      .get();

    if (!question) return null;

    // 获取问题的标签
    const tags = await this.getQuestionTags(id);

    // 增加浏览量
    await db
      .update(schema.questions)
      .set({ views: question.views + 1 })
      .where(eq(schema.questions.id, id));

    return {
      ...question,
      views: question.views + 1, // 立即更新前端显示的浏览量
      tags: tags.map(tag => tag.name)
    };
  }

  // 获取问题的标签
  async getQuestionTags(questionId: string) {
    return db
      .select({
        id: schema.tags.id,
        name: schema.tags.name
      })
      .from(schema.questionTags)
      .innerJoin(schema.tags, eq(schema.questionTags.tagId, schema.tags.id))
      .where(eq(schema.questionTags.questionId, questionId));
  }

  // 按标签获取问题
  async getQuestionsByTag(tagId: string, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const questionIds = await db
      .select({ id: schema.questionTags.questionId })
      .from(schema.questionTags)
      .where(eq(schema.questionTags.tagId, tagId));

    if (questionIds.length === 0) {
      return {
        questions: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }

    const questions = await db
      .select({
        id: schema.questions.id,
        title: schema.questions.title,
        content: schema.questions.content,
        votes: schema.questions.votes,
        answers: schema.questions.answerCount,
        views: schema.questions.views,
        status: schema.questions.status,
        isSolved: schema.questions.isSolved,
        createdAt: schema.questions.createdAt,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        }
      })
      .from(schema.questions)
      .innerJoin(schema.users, eq(schema.questions.authorId, schema.users.id))
      .where(inArray(schema.questions.id, questionIds.map(q => q.id)))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.questions.createdAt));

    // 获取总数
    const countResult = await db
      .select({ count: db.fn.count() })
      .from(schema.questionTags)
      .where(eq(schema.questionTags.tagId, tagId))
      .get();

    const totalQuestions = countResult?.count || 0;
    const totalPages = Math.ceil(totalQuestions / limit);

    // 为每个问题获取标签
    const questionsWithTags = await Promise.all(
      questions.map(async (question) => {
        const tags = await this.getQuestionTags(question.id);
        return {
          ...question,
          tags: tags.map(tag => tag.name)
        };
      })
    );

    return {
      questions: questionsWithTags,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalQuestions,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  // 搜索问题
  async searchQuestions(query: string, type = 'all', page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    let baseQuery = db
      .select({
        id: schema.questions.id,
        title: schema.questions.title,
        content: schema.questions.content,
        votes: schema.questions.votes,
        answers: schema.questions.answerCount,
        views: schema.questions.views,
        status: schema.questions.status,
        isSolved: schema.questions.isSolved,
        createdAt: schema.questions.createdAt,
        author: {
          id: schema.users.id,
          name: schema.users.name,
          avatar: schema.users.avatar
        }
      })
      .from(schema.questions)
      .innerJoin(schema.users, eq(schema.questions.authorId, schema.users.id));

    // 根据搜索类型添加不同的条件
    if (type === 'content') {
      baseQuery = baseQuery.where(
        sql`(${schema.questions.title} LIKE ${'%' + query + '%'} OR ${schema.questions.content} LIKE ${'%' + query + '%'})`
      );
    } else if (type === 'author') {
      baseQuery = baseQuery.where(
        like(schema.users.name, `%${query}%`)
      );
    } else if (type === 'tag') {
      // 获取匹配标签的问题ID
      const taggedQuestionIds = await db
        .select({ id: schema.questionTags.questionId })
        .from(schema.questionTags)
        .innerJoin(schema.tags, eq(schema.questionTags.tagId, schema.tags.id))
        .where(like(schema.tags.name, `%${query}%`));

      if (taggedQuestionIds.length > 0) {
        baseQuery = baseQuery.where(
          inArray(schema.questions.id, taggedQuestionIds.map(q => q.id))
        );
      } else {
        // 如果没有匹配的标签，返回空结果
        return {
          questions: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      }
    } else {
      // 'all' 类型，搜索所有字段
      // 对标题、内容进行搜索
      const textMatchCondition = sql`(${schema.questions.title} LIKE ${'%' + query + '%'} OR ${schema.questions.content} LIKE ${'%' + query + '%'})`;

      // 对作者名进行搜索
      const authorMatchCondition = like(schema.users.name, `%${query}%`);

      // 查找匹配标签的问题ID
      const taggedQuestionIds = await db
        .select({ id: schema.questionTags.questionId })
        .from(schema.questionTags)
        .innerJoin(schema.tags, eq(schema.questionTags.tagId, schema.tags.id))
        .where(like(schema.tags.name, `%${query}%`));

      // 组合搜索条件
      if (taggedQuestionIds.length > 0) {
        baseQuery = baseQuery.where(
          sql`${textMatchCondition} OR ${authorMatchCondition} OR ${inArray(schema.questions.id, taggedQuestionIds.map(q => q.id))}`
        );
      } else {
        baseQuery = baseQuery.where(
          sql`${textMatchCondition} OR ${authorMatchCondition}`
        );
      }
    }

    // 执行分页查询
    const questions = await baseQuery
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.questions.createdAt));

    // 获取总数进行分页计算
    let totalQuestions = 0;

    // 为了简单起见，这里可以重用上面的查询来计算总数
    // 在实际场景中，你可能想要一个更高效的计数查询
    const countQuery = await baseQuery.all();
    totalQuestions = countQuery.length;

    const totalPages = Math.ceil(totalQuestions / limit);

    // 为每个问题获取标签
    const questionsWithTags = await Promise.all(
      questions.map(async (question) => {
        const tags = await this.getQuestionTags(question.id);
        return {
          ...question,
          tags: tags.map(tag => tag.name)
        };
      })
    );

    return {
      questions: questionsWithTags,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalQuestions,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }
}
