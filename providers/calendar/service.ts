import ClientBaseService from "@/libs/client/base.service"

class CalendarService extends ClientBaseService {
  prefix = "/api"

  async getCalendar({ filters, pagination, sorters }: { filters: any, pagination: any, sorters: any }) {
    return this.post({ filters, pagination, sorters }, `${this.prefix}/schedule`, {})
  }
}

const calendarService = new CalendarService()
export default calendarService 