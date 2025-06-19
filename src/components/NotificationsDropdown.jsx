import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import { useRealtimeNotifications } from '@/hooks/use-realtime-notifications';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsDropdown() {
  // const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealtimeNotifications();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="font-semibold">Notifications</h2>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
