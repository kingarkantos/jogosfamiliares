export function getNextThursday(): Date {
  const now = new Date();
  const result = new Date(now);
  const currentDay = now.getDay(); // 0 = Sunday, 4 = Thursday
  const targetDay = 4; // Thursday

  let daysUntilThursday = (targetDay - currentDay + 7) % 7;
  if (daysUntilThursday === 0) {
    // If today is Thursday, check if evening passed (after 23:00), else it is today
    if (now.getHours() >= 23) {
      daysUntilThursday = 7;
    }
  }

  result.setDate(now.getDate() + daysUntilThursday);
  result.setHours(19, 30, 0, 0); // Scheduled for 19:30 on Thursdays
  return result;
}

export function getCountdownToNextThursday(): { days: number; hours: number; minutes: number; isToday: boolean } {
  const now = new Date();
  const next = getNextThursday();
  const diffMs = next.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, isToday: true };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    days,
    hours,
    minutes,
    isToday: now.getDay() === 4
  };
}

export function formatDatePt(isoDate: string, includeTime = false): string {
  try {
    const d = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
    };
    return d.toLocaleDateString('pt-BR', options);
  } catch {
    return isoDate;
  }
}

export function formatDateWithWeekday(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta-feira', 'Sexta', 'Sábado'];
    const weekday = dayNames[d.getDay()];
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${weekday}, ${day}/${month}/${year}`;
  } catch {
    return isoDate;
  }
}

export function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-Semana-${String(weekNo).padStart(2, '0')}`;
}

export function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getMonthLabel(monthKey: string): string {
  try {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const name = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return monthKey;
  }
}
