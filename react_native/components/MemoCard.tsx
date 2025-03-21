import { bookmarkProps, Memo, MemoType, noteProps } from '@/api/types';
import { NoteCard } from './NoteCard';
import { BookmarkCard } from './BookmarkCard';

type Props = {
  data: Memo,
};

export function MemoCard({ data }: Props) {
  if (data.type === MemoType.NOTE) {
    return <NoteCard {...(noteProps(data))} />;
  }

  if (data.type === MemoType.BOOKMARK) {
    return <BookmarkCard {...(bookmarkProps(data))} />;
  }

  return null;
}
