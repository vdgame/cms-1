import type { APIRoute } from 'astro';
import { commentService } from '../../../services';

// GET：获取评论
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const targetType = url.searchParams.get('targetType') as 'question' | 'answer' | null;
    const targetId = url.searchParams.get('targetId');

    // 验证必填字段
    if (!targetType || !targetId) {
      return new Response(JSON.stringify({ error: 'Target type and target ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证 targetType
    if (!['question', 'answer'].includes(targetType)) {
      return new Response(JSON.stringify({ error: 'Invalid target type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const comments = await commentService.getCommentsByTarget(targetType, targetId);

    return new Response(JSON.stringify(comments), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST：创建新评论
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { authorId, targetType, targetId, content, parentId } = body;

    // 验证必填字段
    if (!authorId || !targetType || !targetId || !content) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证 targetType
    if (!['question', 'answer'].includes(targetType)) {
      return new Response(JSON.stringify({ error: 'Invalid target type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const comment = await commentService.createComment(
      authorId,
      targetType,
      targetId,
      content,
      parentId
    );

    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
