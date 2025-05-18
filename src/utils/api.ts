// 基础API URL
const BASE_URL = '/api';

// 获取当前登录用户ID (模拟)
// 在实际应用中，这应该是从认证系统获取的
export const getCurrentUserId = (): string => {
  return 'meathill'; // 默认用户，在实际应用中应该通过认证系统获取
};

// API请求工具函数
export const api = {
  // 通用GET请求
  async get(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);

    // 添加查询参数
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error);
      throw error;
    }
  },

  // 通用POST请求
  async post(endpoint: string, data: Record<string, any> = {}) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error);
      throw error;
    }
  },

  // 通用PUT请求
  async put(endpoint: string, data: Record<string, any> = {}) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API PUT error for ${endpoint}:`, error);
      throw error;
    }
  },

  // 通用DELETE请求
  async delete(endpoint: string) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API DELETE error for ${endpoint}:`, error);
      throw error;
    }
  },

  // 用户相关API
  users: {
    // 获取用户详情
    getById(userId: string) {
      return api.get(`/users/${userId}`);
    },
  },

  // 问题相关API
  questions: {
    // 获取问题列表
    getList(page = 1, limit = 10) {
      return api.get('/questions', { page, limit });
    },

    // 获取问题详情
    getById(questionId: string) {
      return api.get(`/questions/${questionId}`);
    },

    // 创建问题
    create(title: string, content: string, tags: string[] = []) {
      return api.post('/questions', {
        authorId: getCurrentUserId(),
        title,
        content,
        tags
      });
    },

    // 编辑问题
    edit(id: string, title: string, content: string, tags: string[] = []) {
      return api.put('/questions/edit', {
        id,
        authorId: getCurrentUserId(),
        title,
        content,
        tags
      });
    },

    // 删除问题
    delete(id: string) {
      return api.delete(`/questions/delete?id=${id}&authorId=${getCurrentUserId()}`);
    },
  },

  // 回答相关API
  answers: {
    // 获取问题的回答
    getByQuestion(questionId: string) {
      return api.get(`/questions/${questionId}/answers`);
    },

    // 创建回答
    create(questionId: string, content: string) {
      return api.post('/answers', {
        authorId: getCurrentUserId(),
        questionId,
        content
      });
    },

    // 编辑回答
    edit(id: string, content: string) {
      return api.put('/answers/edit', {
        id,
        authorId: getCurrentUserId(),
        content
      });
    },

    // 删除回答
    delete(id: string) {
      return api.delete(`/answers/delete?id=${id}&authorId=${getCurrentUserId()}`);
    },

    // 标记为最佳回答
    markAsBest(answerId: string, questionId: string) {
      return api.post('/answers/accept', {
        answerId,
        questionId,
        userId: getCurrentUserId()
      });
    }
  },

  // 搜索API
  search: {
    // 搜索问题
    questions(query: string, type = 'all', page = 1, limit = 10) {
      return api.get('/search', { q: query, type, page, limit });
    },
  },

  // 标签相关API
  tags: {
    // 获取标签列表
    getList(page = 1, limit = 20) {
      return api.get('/tags', { page, limit });
    },

    // 获取标签详情
    getById(tagId: string, page = 1, limit = 10) {
      return api.get(`/tags/${tagId}`, { page, limit });
    },

    // 获取热门标签
    getPopular(limit = 10) {
      return api.get('/tags/popular', { limit });
    },

    // 关注标签
    follow(tagId: string) {
      return api.post('/tags/follow', {
        userId: getCurrentUserId(),
        tagId,
        action: 'follow',
      });
    },

    // 取消关注标签
    unfollow(tagId: string) {
      return api.post('/tags/follow', {
        userId: getCurrentUserId(),
        tagId,
        action: 'unfollow',
      });
    },
  },

  // 评论相关API
  comments: {
    // 获取目标的评论
    getByTarget(targetType: 'question' | 'answer', targetId: string) {
      return api.get('/comments', { targetType, targetId });
    },

    // 获取评论详情
    getById(commentId: string) {
      return api.get(`/comments/${commentId}`);
    },

    // 创建评论
    create(targetType: 'question' | 'answer', targetId: string, content: string, parentId?: string) {
      return api.post('/comments', {
        authorId: getCurrentUserId(),
        targetType,
        targetId,
        content,
        parentId,
      });
    },

    // 更新评论
    update(commentId: string, content: string) {
      return api.put(`/comments/${commentId}`, { content });
    },

    // 删除评论
    delete(commentId: string) {
      return api.delete(`/comments/${commentId}`);
    },

    // 投票评论
    vote(commentId: string, value: 1 | -1) {
      return api.post('/comments/vote', {
        userId: getCurrentUserId(),
        commentId,
        value,
      });
    },
  },

  // 交互相关API
  interactions: {
    // 获取用户与目标的交互状态
    getStatus(targetType: string, targetId: string) {
      return api.get('/interactions/status', {
        userId: getCurrentUserId(),
        targetType,
        targetId,
      });
    },

    // 投票（点赞/踩）
    vote(targetType: 'question' | 'answer' | 'comment', targetId: string, value: 1 | -1) {
      return api.post('/interactions/vote', {
        userId: getCurrentUserId(),
        targetType,
        targetId,
        value,
      });
    },

    // 收藏问题
    bookmark(questionId: string) {
      return api.post('/interactions/bookmark', {
        userId: getCurrentUserId(),
        questionId,
      });
    },

    // 举报内容
    report(targetType: 'question' | 'answer' | 'comment', targetId: string, reason: string, description?: string) {
      return api.post('/interactions/report', {
        userId: getCurrentUserId(),
        targetType,
        targetId,
        reason,
        description,
      });
    },
  },
};
