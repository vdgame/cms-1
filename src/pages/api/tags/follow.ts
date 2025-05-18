import type { APIRoute } from 'astro';
import { userService } from '../../../services';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, tagId, action } = body;

    // 验证必填字段
    if (!userId || !tagId || !action) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 验证 action
    if (!['follow', 'unfollow'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;

    if (action === 'follow') {
      result = await userService.followTag(userId, tagId);
    } else {
      result = await userService.unfollowTag(userId, tagId);
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing tag follow action:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
