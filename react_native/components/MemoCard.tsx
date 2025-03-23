import { bookmarkProps, Memo, MemoType, noteProps } from '@/client-server-public/types';
import { NoteCard } from './NoteCard';
import { BookmarkCard } from './BookmarkCard';

type Props = {
  data: Memo,
  onDelete: () => void
  onUpdateContext: (content: string) => void
};

export function MemoCard({ data, onDelete, onUpdateContext }: Props) {
  if (data.type === MemoType.NOTE) {
    return <NoteCard onUpdateContext={onUpdateContext} onDelete={onDelete} {...(noteProps(data))} />;
  }

  if (data.type === MemoType.BOOKMARK) {
    return <BookmarkCard {...(bookmarkProps(data))} />;
  }

  return null;
}
