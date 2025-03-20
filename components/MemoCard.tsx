import { Bookmark, MemoType, Note } from '@/api/types';
import { NoteCard } from './NoteCard';
import { BookmarkCard } from './BookmarkCard';

type Props = {
  type: MemoType,
  data: Note | Bookmark,
};

export function MemoCard({ type, data }: Props) {
  if (type === MemoType.NOTE) {
    return <NoteCard data={data as Note} />;
  }

  if (type === MemoType.BOOKMARK) {
    return <BookmarkCard data={data as Bookmark} />;
  }

  return null;
}
