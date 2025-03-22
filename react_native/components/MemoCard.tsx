import { bookmarkProps, Memo, MemoType, noteProps } from '@/api/types';
import { NoteCard } from './NoteCard';
import { BookmarkCard } from './BookmarkCard';

type Props = {
  data: Memo,
  onDelete: () => void
};

export function MemoCard({ data, onDelete }: Props) {
  if (data.type === MemoType.NOTE) {
    return <NoteCard onDelete={onDelete} {...(noteProps(data))} />;
  }

  if (data.type === MemoType.BOOKMARK) {
    return <BookmarkCard {...(bookmarkProps(data))} />;
  }

  return null;
}
