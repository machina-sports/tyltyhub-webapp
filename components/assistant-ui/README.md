# Assistant UI - Modular Architecture

This directory contains the refactored assistant UI components, evolved from the dazn-moderator implementation while maintaining sportingbet-cwc's page and modal architecture.

## 📁 Structure

```
assistant-ui/
├── README.md                      # This file
├── assistant-modal.tsx            # Main modal orchestrator (200 lines, was 700)
├── streaming-adapter.ts           # Enhanced streaming adapter with dazn improvements
├── ChatContent.tsx                # Shared chat UI (works in modal and page)
├── ChatHeader.tsx                 # Header with expand/close controls
├── AssistantMessage.tsx           # Assistant message rendering with widgets
├── UserMessage.tsx                # User message rendering
├── ObjectCards.tsx                # Object card rendering (events, matches)
├── SuggestionsWidget.tsx          # Follow-up suggestions widget
└── hooks/
    ├── index.ts                   # Hook exports
    ├── useThreadHistory.ts        # Thread history loading
    ├── useAssistantAdapter.ts     # Adapter creation and memoization
    └── useMessageRefs.ts          # Object/suggestion refs management
```

## 🎯 Key Improvements

### 1. **Modular Components**
- **700 lines → 200 lines** in main orchestrator
- Each component has single responsibility
- Easy to test and maintain

### 2. **Enhanced Streaming Adapter**
From dazn-moderator improvements:
- ✅ `hasReceivedFinalContent` flag prevents flickering
- ✅ Better `workflow_objects` handling (not conditional)
- ✅ Sophisticated object mapping during streaming
- ✅ Status updates always show (not conditional on objects)
- ✅ Multiple text association for smooth transitions

### 3. **Custom Hooks**
Three clean hooks extract complexity:
- **`useThreadHistory`** - Loads and manages thread history
- **`useAssistantAdapter`** - Creates memoized streaming adapter
- **`useMessageRefs`** - Manages objects/suggestions refs

### 4. **Mode Support**
Maintains sportingbet-cwc's architecture:
- **`modal`** - Fixed bottom-right modal
- **`page`** - Full page view (for `/assistant/[id]` routes)

## 🚀 Usage

### Modal Mode (Default)
```typescript
import { AssistantModal } from "@/components/assistant-ui/assistant-modal";

// In your layout/page
<AssistantModal />
```

### Page Mode
```typescript
import { AssistantRuntimeProvider, useLocalRuntime } from "@assistant-ui/react";
import { ChatContent } from "@/components/assistant-ui/ChatContent";
import { useAssistantAdapter, useMessageRefs } from "@/components/assistant-ui/hooks";

// Create adapter and runtime
const adapter = useAssistantAdapter({...});
const runtime = useLocalRuntime(adapter, { initialMessages });

// Render chat content
<AssistantRuntimeProvider runtime={runtime}>
  <ChatContent
    mode="page"
    assistantName="Assistant"
    objectsMapRef={objectsMapRef}
    suggestionsMapRef={suggestionsMapRef}
    animatedWidgetsRef={animatedWidgetsRef}
    onClose={handleClose}
  />
</AssistantRuntimeProvider>
```

## 🔧 Configuration

Agent configuration in `assistant-modal.tsx`:
```typescript
const AGENT_CONFIG = {
  streamWorkflows: true, // Enable workflow-by-workflow streaming
};
```

Brand-specific agent ID is automatically determined using `getAgentId(brand.id)`.

## 📊 Component Responsibilities

### `assistant-modal.tsx`
- Orchestrates modal lifecycle
- Manages thread loading state
- Handles chat bubble button
- Delegates rendering to `ChatContent`

### `ChatContent.tsx`
- Core chat UI (works in modal and page)
- Thread messages rendering
- Composer input
- Scroll-to-bottom button

### `AssistantMessage.tsx`
- Renders assistant messages
- Extracts articles and betting markets from objects
- Handles suggestions clicks
- Manages widget animations

### `UserMessage.tsx`
- Simple user message rendering
- User icon display

### `ChatHeader.tsx`
- Brand logo
- Assistant name
- Expand button (modal only)
- Close button

### `ObjectCards.tsx`
- Renders event/match cards
- Date/time formatting
- Competition and venue display
- Score display for live/ended matches

### `SuggestionsWidget.tsx`
- Renders follow-up suggestions
- Animated appearance
- Click handling

## 🎨 Styling

Components use:
- Tailwind CSS classes
- Brand-specific colors via `bg-brand-primary`, `bg-brand-secondary`
- Mode-aware responsive classes
- Framer Motion for animations

## 🔄 Migration Notes

### From Old Architecture
The old 700-line monolithic `assistant-modal.tsx` is now split into:
- 1 orchestrator (200 lines)
- 8 focused components
- 3 custom hooks

### Breaking Changes
✅ **None!** The API remains the same:
```typescript
<AssistantModal />
```

### Benefits
- ✅ 71% reduction in main file size
- ✅ Better testability
- ✅ Improved maintainability
- ✅ Fixed streaming flickering issues
- ✅ Better status update handling

## 📝 Development

### Adding New Widget Types
1. Extract widget logic in `AssistantMessage.tsx`
2. Create dedicated widget component (e.g., `PollWidget.tsx`)
3. Add to `AnimatePresence` blocks

### Modifying Streaming Behavior
Edit `streaming-adapter.ts`:
- Chunk type handling in main loop
- Object association logic
- Status message formatting

### Customizing UI
- Edit individual components
- All styling is in Tailwind classes
- Brand theming via CSS variables

## 🐛 Troubleshooting

### Objects not showing
Check `objectsMapRef` associations in console:
```typescript
console.log('[StreamAdapter] Associating objects with text:', textContent);
```

### Flickering widgets
Ensure `animatedWidgetsRef` properly tracks shown widgets:
```typescript
animatedWidgetsRef.current.add(`markets-${textContent}`);
```

### Status updates not appearing
Check `hasReceivedFinalContent` flag - status updates are suppressed after final content.

## 📚 Related Files

- `/lib/agent-config.ts` - Agent ID configuration
- `/hooks/use-brand-texts.ts` - Brand-specific text content
- `/contexts/brand-context.tsx` - Brand configuration
- `/providers/assistant/use-assistant.tsx` - Assistant state management

## 🎯 Next Steps

Future enhancements:
- [ ] Add unit tests for each component
- [ ] Create Storybook stories
- [ ] Add accessibility improvements
- [ ] Support for more widget types
- [ ] Add message editing/deletion

