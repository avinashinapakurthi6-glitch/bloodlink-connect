import { Bookmark, Menu } from 'lucide-react';

export default function TopHeaderBar() {
  return (
    <div className='flex h-16 items-center justify-between border-b px-4'>
      <Bookmark className='text-gray-600' />
      <Menu className='text-gray-600' />
    </div>
  );
}