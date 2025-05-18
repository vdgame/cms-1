-- 创建评论表
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES users(id),
  target_type TEXT NOT NULL, -- 'question' 或 'answer'
  target_id TEXT NOT NULL,
  parent_id TEXT, -- 父评论ID，用于嵌套评论，NULL表示顶级评论
  votes INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT,

  -- 添加索引加速查询
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
