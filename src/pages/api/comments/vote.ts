import type { APIRoute } from 'astro';
import { commentService, interactionService } from '../../../services';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, commentId, value } = body;

    // 验证必填字段
    if (!userId || !commentId || value === undefined) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证 value
    if (value !== 1 && value !== -1) {
      return new Response(JSON.stringify({ error: 'Value must be 1 or -1' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 检查是否已经投票
    const existingVote = await interactionService.getUserInteractions(userId, 'comment', commentId);
    let result;

    if (existingVote.voted === value) {
      // 如果已经投了相同的票，取消投票
      await interactionService.vote(userId, 'comment', commentId, value);
      // 更新评论的投票计数
      await commentService.voteComment(commentId, -value);
      result = { status: 'removed', value: 0 };
    } else if (existingVote.voted === 0) {
      // 如果之前没有投票，添加新投票
      await interactionService.vote(userId, 'comment', commentId, value);
      // 更新评论的投票计数
      await commentService.voteComment(commentId, value);
      result = { status: 'added', value };
    } else {
      // 如果之前投了相反的票，更新投票
      await interactionService.vote(userId, 'comment', commentId, value);
      // 更新评论的投票计数（加倍因为要取消之前的票）
      await commentService.voteComment(commentId, 2 * value);
      result = { status: 'updated', value };
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing comment vote:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
