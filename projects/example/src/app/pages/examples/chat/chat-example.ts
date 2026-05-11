import { Component, signal, computed, ElementRef, viewChild, AfterViewChecked } from '@angular/core';
import { PkSidenav, PkIcon, type PkSidenavGroup } from 'ngx-pk-ui';

// ── Current user ──────────────────────────────────────────────────────────────
export interface ChatUser {
  id: number;
  name: string;
  initials: string;
  avatarColor: string;
  status: 'online' | 'offline' | 'away';
  role: string;
  email?: string;
  phone?: string;
  hours?: string;
}

export interface ChatMessage {
  id: number;
  senderId: number;          // 0 = current user (me)
  text?: string;
  file?: { name: string; size: string };
  timestamp: string;
  seen: boolean;
}

export interface Conversation {
  id: number;
  type: 'peer' | 'group';
  name: string;
  initials: string;
  avatarColor: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  status: 'online' | 'offline' | 'away';
  peer?: ChatUser;
  participants?: ChatUser[];
  messages: ChatMessage[];
}

// ── Fake data ─────────────────────────────────────────────────────────────────
const ME = { id: 0, name: 'Zarela Reed', initials: 'ZR', avatarColor: '#6366f1' };

const USERS: ChatUser[] = [
  { id: 1, name: 'Gerald Dean',      initials: 'GD', avatarColor: '#6366f1', status: 'online',  role: 'Sales Manager',   email: 'gerald@whelp.net',  phone: '+1 (786) 123-4567', hours: 'Mon-Fri 9am-6pm' },
  { id: 2, name: 'Aris Christofi',   initials: 'AC', avatarColor: '#0ea5e9', status: 'online',  role: 'Admin',           email: 'support@whelp.net', phone: '+1 (786) 903-7331', hours: 'Mon-Fri 9am-6pm' },
  { id: 3, name: 'Eddie Barnett',    initials: 'EB', avatarColor: '#f59e0b', status: 'offline', role: 'Developer',       email: 'eddie@whelp.net' },
  { id: 4, name: 'Julian Mendez',    initials: 'JM', avatarColor: '#10b981', status: 'away',    role: 'Designer',        email: 'julian@whelp.net' },
  { id: 5, name: 'Henry Drake',      initials: 'HD', avatarColor: '#ef4444', status: 'online',  role: 'QA Engineer' },
  { id: 6, name: 'Mabelle McKenzie', initials: 'MM', avatarColor: '#8b5cf6', status: 'offline', role: 'Product Manager' },
  { id: 7, name: 'Shawn Spencer',    initials: 'SS', avatarColor: '#ec4899', status: 'online',  role: 'Marketing' },
  { id: 8, name: 'Lena Kovalska',    initials: 'LK', avatarColor: '#14b8a6', status: 'online',  role: 'UX Designer',     email: 'lena@whelp.net' },
  { id: 9, name: 'Marco Rossi',      initials: 'MR', avatarColor: '#f97316', status: 'away',    role: 'Backend Dev' },
];

const CONVS: Conversation[] = [
  {
    id: 1, type: 'peer', name: 'Gerald Dean', initials: 'GD', avatarColor: '#6366f1',
    lastMessage: 'I am ready.', lastTime: '6:50 pm', unread: 0, status: 'online', peer: USERS[0],
    messages: [
      { id: 1, senderId: 1, text: 'Hey! Are you free for a quick sync today?', timestamp: '6:40 pm', seen: true },
      { id: 2, senderId: 0, text: 'Sure, I can do 3 pm. Does that work?', timestamp: '6:42 pm', seen: true },
      { id: 3, senderId: 1, text: 'Perfect! Sending the invite now.', timestamp: '6:44 pm', seen: true },
      { id: 4, senderId: 0, text: 'Got it, see you then!', timestamp: '6:46 pm', seen: true },
      { id: 5, senderId: 1, text: 'I am ready.', timestamp: '6:50 pm', seen: true },
    ],
  },
  {
    id: 2, type: 'peer', name: 'Aris Christofi', initials: 'AC', avatarColor: '#0ea5e9',
    lastMessage: 'You are most welcome. 😊', lastTime: '2:44 pm', unread: 1, status: 'online', peer: USERS[1],
    messages: [
      { id: 1, senderId: 2, text: 'This powerful marketing tool is often used as a matter of fact, and we have to wonder about its real impact on our campaigns.', timestamp: '2:30 pm', seen: true },
      { id: 2, senderId: 2, text: 'Everybody that has ever been to a meeting can recall the all-familiar "passing" the business cards. This powerful marketing tool is often overlooked in digital campaigns.', timestamp: '2:35 pm', seen: true },
      { id: 3, senderId: 2, file: { name: 'Style Sheet.zip', size: '350.43 kb' }, timestamp: '2:40 pm', seen: true },
      { id: 4, senderId: 0, text: 'Thanks for the file sharing. That reminds me — I can recall the familiar "passing" of business cards at every meeting.', timestamp: '2:41 pm', seen: true },
      { id: 5, senderId: 0, text: 'You are most welcome. 😊', timestamp: '2:44 pm', seen: false },
    ],
  },
  {
    id: 3, type: 'peer', name: 'Eddie Barnett', initials: 'EB', avatarColor: '#f59e0b',
    lastMessage: 'Thanks', lastTime: '3:30 pm', unread: 0, status: 'offline', peer: USERS[2],
    messages: [
      { id: 1, senderId: 0, text: 'Eddie, can you review the PR I submitted this morning?', timestamp: '3:10 pm', seen: true },
      { id: 2, senderId: 3, text: 'Sure thing, checking it now.', timestamp: '3:22 pm', seen: true },
      { id: 3, senderId: 3, text: 'Looks good! Left a couple of minor comments.', timestamp: '3:28 pm', seen: true },
      { id: 4, senderId: 0, text: "Awesome, I'll address them right away.", timestamp: '3:29 pm', seen: true },
      { id: 5, senderId: 3, text: 'Thanks', timestamp: '3:30 pm', seen: true },
    ],
  },
  {
    id: 4, type: 'peer', name: 'Julian Mendez', initials: 'JM', avatarColor: '#10b981',
    lastMessage: 'Are you sure?', lastTime: '11:15 am', unread: 3, status: 'away', peer: USERS[3],
    messages: [
      { id: 1, senderId: 0, text: 'Julian, I want to update the dashboard design. Can we remove the old chart widget?', timestamp: '11:00 am', seen: true },
      { id: 2, senderId: 4, text: 'That widget has been there for 2 years... are you sure we should remove it?', timestamp: '11:10 am', seen: true },
      { id: 3, senderId: 0, text: 'Yes, the new analytics panel covers everything it does.', timestamp: '11:12 am', seen: true },
      { id: 4, senderId: 4, text: 'Are you sure?', timestamp: '11:15 am', seen: false },
    ],
  },
  {
    id: 5, type: 'peer', name: 'Henry Drake', initials: 'HD', avatarColor: '#ef4444',
    lastMessage: 'What can I do right now?', lastTime: 'Yesterday', unread: 0, status: 'online', peer: USERS[4],
    messages: [
      { id: 1, senderId: 5, text: "The test suite is failing on CI. I'm looking into it.", timestamp: 'Yesterday', seen: true },
      { id: 2, senderId: 0, text: 'Let me know if you need access to the logs.', timestamp: 'Yesterday', seen: true },
      { id: 3, senderId: 5, text: 'What can I do right now?', timestamp: 'Yesterday', seen: true },
    ],
  },
  {
    id: 6, type: 'peer', name: 'Mabelle McKenzie', initials: 'MM', avatarColor: '#8b5cf6',
    lastMessage: 'I am glad.', lastTime: '1 day ago', unread: 0, status: 'offline', peer: USERS[5],
    messages: [
      { id: 1, senderId: 0, text: 'Mabelle, the product roadmap is finalized. Can you update the stakeholder deck?', timestamp: '1 day ago', seen: true },
      { id: 2, senderId: 6, text: "Of course! I'll have it ready by EOD.", timestamp: '1 day ago', seen: true },
      { id: 3, senderId: 0, text: "You're amazing, thank you!", timestamp: '1 day ago', seen: true },
      { id: 4, senderId: 6, text: 'I am glad.', timestamp: '1 day ago', seen: true },
    ],
  },
  {
    id: 7, type: 'group', name: 'Team Alpha', initials: 'TA', avatarColor: '#3b82f6',
    lastMessage: 'Meeting notes are in the shared folder.', lastTime: '3 days ago', unread: 5, status: 'online',
    participants: [USERS[0], USERS[1], USERS[2], USERS[3]],
    messages: [
      { id: 1, senderId: 1, text: 'Team, just a reminder — stand-up at 9 am tomorrow.', timestamp: '3 days ago', seen: true },
      { id: 2, senderId: 3, text: 'Got it! Will the backlog review be included?', timestamp: '3 days ago', seen: true },
      { id: 3, senderId: 2, text: 'Yes, please come prepared with your sprint updates.', timestamp: '3 days ago', seen: true },
      { id: 4, senderId: 0, text: "I'll have the design mockups ready by then.", timestamp: '3 days ago', seen: true },
      { id: 5, senderId: 4, text: 'Meeting notes are in the shared folder.', timestamp: '3 days ago', seen: true },
    ],
  },
  {
    id: 8, type: 'group', name: 'Design Team', initials: 'DT', avatarColor: '#ec4899',
    lastMessage: 'Figma link shared in thread.', lastTime: '12 March', unread: 0, status: 'online',
    participants: [USERS[3], USERS[7], USERS[5]],
    messages: [
      { id: 1, senderId: 8, text: "I've updated the component library with the new design tokens. Check it out!", timestamp: '12 March', seen: true },
      { id: 2, senderId: 4, text: 'Looks great! The spacing system is much cleaner now.', timestamp: '12 March', seen: true },
      { id: 3, senderId: 0, text: 'Can you share the Figma link?', timestamp: '12 March', seen: true },
      { id: 4, senderId: 8, text: 'Figma link shared in thread.', timestamp: '12 March', seen: true },
    ],
  },
  {
    id: 9, type: 'peer', name: 'Shawn Spencer', initials: 'SS', avatarColor: '#ec4899',
    lastMessage: 'I am ready.', lastTime: '12 March', unread: 0, status: 'offline', peer: USERS[6],
    messages: [
      { id: 1, senderId: 7, text: 'The marketing campaign is live!', timestamp: '12 March', seen: true },
      { id: 2, senderId: 0, text: 'How are the numbers looking?', timestamp: '12 March', seen: true },
      { id: 3, senderId: 7, text: '12% CTR in the first hour. Very promising!', timestamp: '12 March', seen: true },
      { id: 4, senderId: 0, text: "Fantastic! Let's keep monitoring.", timestamp: '12 March', seen: true },
      { id: 5, senderId: 7, text: 'I am ready.', timestamp: '12 March', seen: true },
    ],
  },
];

const CHAT_NAV_GROUPS: PkSidenavGroup[] = [
  {
    items: [
      { key: 'chats',     label: 'Messages',  icon: 'chat' },
      { key: 'contacts',  label: 'Contacts',  icon: 'group' },
      { key: 'history',   label: 'History',   icon: 'history' },
      { key: 'broadcast', label: 'Broadcast', icon: 'tv' },
      { key: 'analytics', label: 'Analytics', icon: 'analytics' },
      { key: 'settings',  label: 'Settings',  icon: 'settings' },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-chat-example',
  standalone: true,
  imports: [PkSidenav, PkIcon],
  templateUrl: './chat-example.html',
  styleUrl: './chat-example.css',
})
export class ChatExample implements AfterViewChecked {
  readonly me = ME;
  readonly navGroups = CHAT_NAV_GROUPS;

  readonly allConversations = signal([...CONVS]);
  navKey        = signal('chats');
  activeConvId  = signal<number | null>(2);
  searchQuery   = signal('');
  newMessage    = signal('');
  showProfile   = signal(true);

  private needsScroll = false;
  readonly msgContainer = viewChild<ElementRef<HTMLDivElement>>('msgContainer');

  readonly filteredConversations = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allConversations();
    return this.allConversations().filter(c => c.name.toLowerCase().includes(q));
  });

  readonly activeConv = computed(() => {
    const id = this.activeConvId();
    return id != null ? (this.allConversations().find(c => c.id === id) ?? null) : null;
  });

  selectConv(conv: Conversation): void {
    this.activeConvId.set(conv.id);
    this.needsScroll = true;
    this.allConversations.update(list =>
      list.map(c => c.id === conv.id ? { ...c, unread: 0 } : c)
    );
  }

  sendMessage(): void {
    const text = this.newMessage().trim();
    if (!text || this.activeConvId() == null) return;
    const convId = this.activeConvId()!;
    const now = new Date();
    const time = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
    const msg: ChatMessage = { id: Date.now(), senderId: 0, text, timestamp: time, seen: false };
    this.allConversations.update(list =>
      list.map(c => c.id === convId ? { ...c, messages: [...c.messages, msg], lastMessage: text, lastTime: 'just now' } : c)
    );
    this.newMessage.set('');
    this.needsScroll = true;
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onNavClick(item: { key: string }): void {
    this.navKey.set(item.key);
  }

  toggleProfile(): void {
    this.showProfile.update(v => !v);
  }

  getUser(id: number): ChatUser | undefined {
    return USERS.find(u => u.id === id);
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      const el = this.msgContainer()?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
        this.needsScroll = false;
      }
    }
  }
}
