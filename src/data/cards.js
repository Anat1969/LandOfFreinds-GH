// תוכן הקלפים. כל השמות, המשפטים והדמויות מקוריים.
// צללים = דחפים או רגשות מאתגרים. אורות = כוחות שעוזרים לנהל אותם.

export const SHADOWS = [
  { id: 's1', deck: 'shadow', name: 'צל הדחייה', whisper: 'מחר, לא עכשיו. מחר זה תמיד נוח יותר.', hue: 262, seed: 11 },
  { id: 's2', deck: 'shadow', name: 'צל הכעס הבוער', whisper: 'זה לא הוגן, ואני חייב להגיד את זה עכשיו.', hue: 2, seed: 23 },
  { id: 's3', deck: 'shadow', name: 'צל החשש', whisper: 'מה אם זה ייגמר רע? מה אם לא אצליח?', hue: 214, seed: 37 },
  { id: 's4', deck: 'shadow', name: 'צל ההשוואה', whisper: 'כולם כבר הגיעו לשם, ואני עדיין כאן.', hue: 292, seed: 41 },
  { id: 's5', deck: 'shadow', name: 'צל הביקורת', whisper: 'אתה תמיד טועה. מי בכלל מחליט שזה בסדר?', hue: 240, seed: 53 },
  { id: 's6', deck: 'shadow', name: 'צל הבהלה', whisper: 'לעשות עכשיו, בלי לחשוב, בלי לעצור.', hue: 22, seed: 67 },
  { id: 's7', deck: 'shadow', name: 'צל הבדידות', whisper: 'אף אחד לא מבין. עדיף לא לבקש כלום.', hue: 200, seed: 71 },
  { id: 's8', deck: 'shadow', name: 'צל הספק', whisper: 'אתה לא מספיק טוב. אתה תמיד תהיה במקום הזה.', hue: 276, seed: 83 },
  { id: 's9', deck: 'shadow', name: 'צל השלמות', whisper: 'אם זה לא מושלם, זה לא שווה כלום.', hue: 168, seed: 97 },
  { id: 's10', deck: 'shadow', name: 'צל האשמה', whisper: 'זה באשמתך. תמיד באשמתך.', hue: 338, seed: 101 },
  { id: 's11', deck: 'shadow', name: 'צל חוסר הסבלנות', whisper: 'למה זה לוקח כל כך הרבה זמן? שיהיה כבר.', hue: 36, seed: 113 },
  { id: 's12', deck: 'shadow', name: 'צל ההתכנסות', whisper: 'אל תצא. בחוץ זה מסוכן ולא צפוי.', hue: 252, seed: 127 },
];

export const LIGHTS = [
  { id: 'l1', deck: 'light', name: 'אור השקט', gift: 'נשימה אחת ארוכה לפני הבחירה.', practice: 'ארבע שניות פנימה, שש החוצה, שלוש פעמים.', hue: 46, seed: 131 },
  { id: 'l2', deck: 'light', name: 'אור הסבלנות', gift: 'לתת לזמן לעבוד בשבילי, צעד אחר צעד.', practice: 'לקבוע זמן קצוב של חמש דקות לפני החלטה.', hue: 92, seed: 137 },
  { id: 'l3', deck: 'light', name: 'אור הגבול', gift: 'אפשר לומר לא, ועדיין להיות אדם טוב.', practice: 'לנסח משפט אחד קצר שמתחיל ב"אני צריך".', hue: 14, seed: 149 },
  { id: 'l4', deck: 'light', name: 'אור הבקשה', gift: 'לבקש עזרה זה כוח, לא חולשה.', practice: 'לכתוב את שם האדם הראשון שאפשר לפנות אליו עכשיו.', hue: 200, seed: 151 },
  { id: 'l5', deck: 'light', name: 'אור הצעד הקטן', gift: 'צעד אחד קטן מספיק כדי להתחיל.', practice: 'לבחור דבר אחד שאפשר לעשות תוך שתי דקות.', hue: 112, seed: 163 },
  { id: 'l6', deck: 'light', name: 'אור הסליחה', gift: 'טעות אחת היא לא כל הסיפור שלי.', practice: 'לכתוב לעצמי משפט אחד שהייתי אומר לחבר קרוב.', hue: 318, seed: 173 },
  { id: 'l7', deck: 'light', name: 'אור הקול הפנימי', gift: 'מה הייתי אומר לחבר הכי טוב שלי עכשיו?', practice: 'לנסח את המשפט הזה בקול רם, בגוף שני.', hue: 60, seed: 179 },
  { id: 'l8', deck: 'light', name: 'אור הגוף', gift: 'לשים לב איפה הרגש יושב בגוף.', practice: 'לשים יד על המקום שבו מרגישים את זה, ולספור עד שלוש.', hue: 160, seed: 181 },
  { id: 'l9', deck: 'light', name: 'אור הדמיון', gift: 'לצייר את הצל ולתת לו צורה חדשה.', practice: 'לצייר במשך דקה את הצל, ואז לשנות לו צבע.', hue: 282, seed: 191 },
  { id: 'l10', deck: 'light', name: 'אור האומץ לשאול', gift: 'שאלה אחת יכולה לפתוח דלת.', practice: 'לכתוב שאלה אחת שמעולם לא שאלתי.', hue: 30, seed: 193 },
  { id: 'l11', deck: 'light', name: 'אור הגמישות', gift: 'אפשר לשנות דרך גם באמצע הדרך.', practice: 'לחשוב על דרך אחרת אחת להגיע לאותה מטרה.', hue: 176, seed: 197 },
  { id: 'l12', deck: 'light', name: 'אור ההכרה', gift: 'לשים לב למה שכבר עובד בלי לשים לב אליו.', practice: 'לכתוב שלושה דברים שכבר עבדו השבוע.', hue: 132, seed: 199 },
];

export const ALL_CARDS = [...SHADOWS, ...LIGHTS];

export function getCard(id) {
  return ALL_CARDS.find((card) => card.id === id) ?? null;
}

export function cardsForDeck(deck) {
  if (deck === 'shadow') return SHADOWS;
  if (deck === 'light') return LIGHTS;
  return ALL_CARDS;
}

export const DECK_LABELS = {
  shadow: 'צללים',
  light: 'אורות',
  all: 'הכול',
};
