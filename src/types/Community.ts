import { Paper } from "./Paper";
import { Event } from "./Event";

export class Community extends Paper {
  constructor(event: Event, width: number = 200, height: number = 150) {
    super({ ...event, type: 'community' }, width, height);
  }

  protected getButtonText(): string {
    if (!this.event.link) return "👥 Join";
    const link = this.event.link.toLowerCase();
    if (link.includes("discord")) return "💬 Discord";
    if (link.includes("slack")) return "💼 Slack";
    if (link.includes("telegram")) return "📱 Telegram";
    if (link.startsWith("http")) return "🌐 Website";
    return "👥 Join";
  }
}


