import ChartList from "./ChartList";
import ChatContent from "./ChatContent";

const Chat = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-64 h-full border-r border-gray-200">
        <ChartList />
      </div>
      <div className="flex-1">
        <ChatContent />
      </div>
    </div>
  );
};

export default Chat;
