import { Drama, Comment, AdminDrama } from "./types";

/* ─── Image URLs from Stitch Designs ─── */
const IMAGES = {
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqw7m1SbliXOyzESNKbWluJ9bym13Yboy0gn2yYR1vmydELcKKSLDT1Rx83wwkjk_6XW-utsH-VP5c2yby8kE9N-7R0w_ViKUUUWR0Bh5FWqhwnTzXjQ0KehnweMJF6167qoILhd1VX0l2eBItzGWiQV1kAZxNN4xjF5hlc5Ztzt97MxtCQttbdcMgooWstlItKT8xZNsCXshzpSCTjHiLkd4_Jl9OoOF-G7tBL82VP4oLwVxuZI9-1Q",
  profileAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVhr2mn4B7CLN1Y7iWZYz_nwtC2ekpVEv6bsAGlpPOGA1P6qMGRIHSv2CCzFJUC3V_dNiknn2y0kHEyY2Q7Nj1RK8j7S5bFaQKugZcZ0kZLa_nlLABOSQgPsdx4tEYCuRWME0wE7fBEgo76_LxlEGLnS-8oThfBM5dlnIF8M5_CXnSai_AksLhD1XDeig45v7JOGDHX88cu1jiMywofzOVSIUythNlrB3r2szpBsb7EYwPllc8EanYkw",
  heroBackdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF13wBZyY6ZqM2HJk4Aw90SUaEUsyO150--L91l3cHg7OUcYJsq_kOqx-A_u24voWWkZ5mJGr92BKczwT7Pp4SIrJt-j0QMpnKk6xug9Gr__l5CD5fSxXsuc6PdZ0y_D5ZCmR59hi5SvnVH25iDBcu0oGBTzjrmhz1YE0b8ABMytGnr9yiPvIc7vlMG8w0s2vz0Kzo9MY_fNPXrPaTVA5WWvgtJBdb8_3Tb2Iq5xQoLJnA-c5pOirtwA",
  poster1: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhb7bYPXoP6iqP7nDT6vV2cngZs7O7g97WzkVlpLVbf1FU5miV-ANP7qQ_yrd56aQzNuK-KfRuWrJeRXF75M2UvAgfb-4-gTqz_9pPtC1RIok97bwKKzlDu5otzsUNH-pQbVRnGTC-oJs9Dt6bs1tMLvx95QJjQ8A0xZl6j1ydfPSF34fc6tnt-RevfW7APEVsBnjmbzEDfe4G0k92iXTZfaapj7Uomnf8stpgAHSRSyJltLHlJMewEw",
  poster2: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvVrrheG9qQAad6NyeDyJeUns1SNeIRuwQX3nddbwK4zey6txp_dXD_Gu0jIeWwWhJUvac9bR07hjl2t00g9sSkYk-RmT8PDpB1xO2uN-DMtMfRt_5SmwQcP6oCChwb5gb_mhfLUYnbbttG5HgzH7KUI7XwAFdWnJEou8uoRUXKgY2tg4iRcqMx-DUmH5L5ceFHKUHIFdL20tjaKp9spAGOmnpztAa0BcyI1YIe14VkzjPUTCFdWP7AA",
  poster3: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0py6aOnJrDCrwcqJ70F81qj0d-jVBQNV2ph_xmJXC1a0Gx8SmLP7PDjWDvhrHrBp-4BTZqYLf371AwccXkS_-XqNl9J2tMx7-ozDnOK0bm8geXyHnSDwjrWnKSmpGdWRNPJEkq66cNmABgEpQB8wmtAPi9CX7pL8LMo4ebFu9jT06AGMNTxdarSxqRisuWQeWiLNrW4ZE5S-w-I8vG5ixcaIn6UO98vcF5P9Yng7nWy_xQf-iQzMuyg",
  poster4: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGDfjuArys1dGHwAnZ8eX45yCQ-OawuZLCgW-sPW7pLGo39RWZU9tB8dz-lRXHCxUMUp7HQ5wPGAbUheutQsAonLEhGHh8itdtgJs2W4dcjCHoOaIbo1w-bHBnXqcsKwFqxp8QJs6PQxkzynG8BpsTYHk0aHiwCM-RwNlToZI69hVCMRsMcprqScMT_G7p8HNPZp3PktmocmDhmVgkVoOHo3QorjsZdCr_zr5B22HY0wF0hwWj1Vlj-w",
  watchBackdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuBeB6xtKHwfrNdCID_LChITEfocvc3AZGNelnX70E4C3TmUVnQrJsdd-uYGM3FOlcSBC_QCN6fwFvblByxehsWGUUkiANi6m_oDHo0Xwl2vtc9ZoufqYQmN8gdNqmXinw-X5_t_Cb171ZO7WFWo986KpuAz4oQ25M1yU_fqfhJIdEJeDnQWMUeL8XsrOv5v5Gy7LJOvOOL-PX8V26thopv8YLJtvf810h0GWGXJYEb_qqeRQF78d-zV7w",
  castActor1: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpiMzdQCqdCrAb-OoqItkgB2HSz_8dJqilHVN14_ckEUfpCc_3NmmregJT6VKZA2JrWNXSzTd7kANlZROMQ7mlZB4gTw8URutQY8xIJk9VCXz-LUZbI7BaMVMUP9IVKT5XP7_4_LEVuqSnd6XTbeIted_on5AEzwJM2CwakRonyI6yHrtrXpvBxhNXiGLPmOIt1t-Z8-a0mkIjk3fOKqqVkP4iscLoR0s5NPihksdQgySw3i70XxXcaA",
  castActor2: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbleXzePWZuFkGhokPl1BfTB6b4w5iDW_oGu9KdG3w9MGSheEl7epR8pPhrrnNEKiyLmw-dDaKtg-L7oYu8v3cJePuaG95hQqSOFtTAlwGs0jRsVHR2NX86lRQMV9fIO4dEY5_ijmP57WsHE64qmZbpUM00Qg9D3Xv3AFS-zajen4SK2eh0fEZ8Ti98mjGVaJxZpv8o4SdBqhtTBmffhUoOwbaSMY6gjfF9sKy4mUstQZpanFdES3Drw",
  castActor3: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6oD3atVPFg3wBvqyz6oTXzLBcEI2cMx_x_IOnjiAPCZiHD4JrM4r6tzsTL8p05-n44I8J_jK20toO3HTltCtDyJAcNT9iJ8jKS_YKwXIBX7n7RIl4j0764Wbr0QSWK4t77xW6Ov10Ls3233XLxVFRablU3WMj5rOtqMQDD2aNLr74Z6hRmSysvkfP_OUVxdK861ByG7SLFWFYl09MmSv0I5_TSowlmnV_1xELgst1BIDiVEm6R8bGhg",
  userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfg4TnJDYeZKj8-ZNSlaARuj0cBeFSZ1coUWtTi0T1WV1RfKyyjux9FlscNJywNXG-_N3ms84GsbGl3Kp2m_4R4J-BUAVsmaIZPzrB_SUQjQJ99GpsMMGnouLbPUA9rcg-KLVS19oZiMUtYc0yfZWLP1LZMe3n8p3l-dwELeCjgYCmvkkjg8HAlSUMDSHc71WB7jptFR9FytIje8nD5f3krPeTEko3QVyAURYufc0hVJYEUrJToHWrBg",
};

export { IMAGES };

/* ─── Mock Dramas ─── */
export const dramas: Drama[] = [
  {
    id: "the-night-watchmans-secret",
    title: "The Night Watchman's Secret",
    titleUz: "Tungi Qorovulning Siri",
    poster: IMAGES.heroBackdrop,
    backdrop: IMAGES.heroBackdrop,
    year: 2024,
    rating: 9.6,
    genres: ["Romance", "Mystery", "Fantasy"],
    country: "South Korea",
    totalEpisodes: 16,
    status: "Ongoing",
    synopsis:
      "Pragmatik detektiv qotillik qurbonlarining so'nggi xotiralarini ko'ra olishini bilgach, shaharning qadimiy sirlarini saqlaydigan yolg'iz tarixchi bilan birgalikda imkonsiz jinoyatlar silsilasini hal qilishi kerak.",
    views: "2.4M",
    cast: [
      { id: "c1", name: "Lee Jun-ho", role: "Detective Kang", avatar: IMAGES.castActor1 },
      { id: "c2", name: "Kim Yoo-jung", role: "Ha-yeon", avatar: IMAGES.castActor2 },
      { id: "c3", name: "Park Sung-woong", role: "Master Jang", avatar: IMAGES.castActor3 },
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Soyalar Uyg'onadi", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "65:00" },
      { id: "ep2", number: 2, title: "Qadimiy Ahd", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "62:00" },
      { id: "ep3", number: 3, title: "Yashirin Xotiralar", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "58:00" },
      { id: "ep4", number: 4, title: "Oy nuri ostida", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "61:00" },
      { id: "ep5", number: 5, title: "Aldanish Poydevori", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "59:00" },
      { id: "ep6", number: 6, title: "Toshqin Oqimi", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "63:00" },
      { id: "ep7", number: 7, title: "Buzilgan Muhr", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "60:00" },
      { id: "ep8", number: 8, title: "Yolg'iz Yulduz", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "64:00" },
    ],
  },
  {
    id: "surgeons-code",
    title: "Surgeon's Code",
    titleUz: "Jarrohning Qonuni",
    poster: IMAGES.poster1,
    backdrop: IMAGES.poster1,
    year: 2024,
    rating: 9.2,
    genres: ["Medical", "Drama"],
    country: "South Korea",
    totalEpisodes: 16,
    status: "Ongoing",
    synopsis:
      "Iste'dodli ayol jarrohi kasalxona siyosati va shaxsiy dramalari orasida muvozanat saqlashga urinadi.",
    views: "1.8M",
    cast: [
      { id: "c4", name: "Song Hye-kyo", role: "Dr. Yoon", avatar: IMAGES.castActor2 },
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Birinchi Kesim", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "55:00" },
      { id: "ep2", number: 2, title: "Umid Iplari", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "52:00" },
      { id: "ep3", number: 3, title: "Tun Navbati", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "58:00" },
      { id: "ep4", number: 4, title: "Qaror Lahzasi", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "54:00" },
      { id: "ep5", number: 5, title: "Tuzalish Yo'li", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "56:00" },
      { id: "ep6", number: 6, title: "Og'riq Durdonasi", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "53:00" },
      { id: "ep7", number: 7, title: "Ishonch Sinovi", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "57:00" },
      { id: "ep8", number: 8, title: "Yashirin Tashxis", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "55:00" },
    ],
  },
  {
    id: "the-crimson-crown",
    title: "The Crimson Crown",
    titleUz: "Qirmizi Toj",
    poster: IMAGES.poster2,
    backdrop: IMAGES.poster2,
    year: 2024,
    rating: 9.5,
    genres: ["Historical", "Action"],
    country: "South Korea",
    totalEpisodes: 20,
    status: "Ongoing",
    synopsis:
      "Yosh malika o'z saltanatini himoya qilish uchun qilichini ko'tarishga majbur bo'ladi.",
    views: "3.1M",
    cast: [
      { id: "c5", name: "Jun Ji-hyun", role: "Queen Seo-yeon", avatar: IMAGES.castActor2 },
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Toj Yuklamasi", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "60:00" },
      { id: "ep2", number: 2, title: "Birinchi Qon", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "58:00" },
    ],
  },
  {
    id: "summer-wind",
    title: "Summer Wind",
    titleUz: "Yoz Shamoli",
    poster: IMAGES.poster3,
    backdrop: IMAGES.poster3,
    year: 2023,
    rating: 8.8,
    genres: ["Slice of Life", "Romance"],
    country: "Japan",
    totalEpisodes: 12,
    status: "Completed",
    synopsis:
      "Ikki o'smirning dengiz bo'yidagi bir yozlik unutilmas hikoyasi.",
    views: "1.2M",
    cast: [
      { id: "c6", name: "Hamabe Minami", role: "Yuki", avatar: IMAGES.castActor2 },
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Uchrashish", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "48:00" },
      { id: "ep2", number: 2, title: "Quyosh Botishi", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "46:00" },
    ],
  },
  {
    id: "neon-echoes",
    title: "Neon Echoes",
    titleUz: "Neon Aks-sadolari",
    poster: IMAGES.poster4,
    backdrop: IMAGES.poster4,
    year: 2024,
    rating: 9.0,
    genres: ["Sci-Fi", "Thriller"],
    country: "China",
    totalEpisodes: 24,
    status: "Ongoing",
    synopsis:
      "Kiberpank shahrida xaker holografik ma'lumotlar ichida yashirin haqiqatni qidiradi.",
    views: "900K",
    cast: [
      { id: "c7", name: "Wang Yibo", role: "Zero", avatar: IMAGES.castActor1 },
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Signal", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "45:00" },
      { id: "ep2", number: 2, title: "Dekodlash", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "44:00" },
    ],
  },
  {
    id: "alchemy-of-souls",
    title: "Alchemy of Souls",
    titleUz: "Ruhlar Alkimyosi",
    poster: IMAGES.watchBackdrop,
    backdrop: IMAGES.watchBackdrop,
    year: 2022,
    rating: 9.4,
    genres: ["Fantasy", "Romance", "Action"],
    country: "South Korea",
    totalEpisodes: 20,
    status: "Completed",
    synopsis:
      "Qadimiy sehrgar olamida ruhlar almashish san'ati butun saltanatni larzaga keltiradi.",
    views: "5.2M",
    cast: [
      { id: "c8", name: "Lee Jae-wook", role: "Jang Uk", avatar: IMAGES.castActor1 },
      { id: "c9", name: "Jung So-min", role: "Mu-deok", avatar: IMAGES.castActor2 },
      { id: "c10", name: "Hwang Min-hyun", role: "Seo Yul", avatar: IMAGES.castActor3 },
    ],
    episodes: [
      { id: "ep1", number: 1, title: "Ruh Ko'chirish", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "68:00" },
      { id: "ep2", number: 2, title: "Songrim", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "65:00" },
      { id: "ep3", number: 3, title: "Sehrli Sinov", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "62:00" },
      { id: "ep4", number: 4, title: "Maxfiy Mashg'ulot", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "66:00" },
      { id: "ep5", number: 5, title: "Taqdir Tugunlari", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "63:00" },
      { id: "ep6", number: 6, title: "Duel Kechasi", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "67:00" },
      { id: "ep7", number: 7, title: "Yin-Yang Nefrit", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "64:00" },
      { id: "ep8", number: 8, title: "Soyalar Siri", moverEmbedUrl: "https://mover.uz/video/embed/gRa8lQyI", duration: "69:00" },
    ],
  },
];

/* ─── Mock Comments ─── */
export const comments: Comment[] = [
  {
    id: "cm1",
    user: { name: "DoramaFan_UZ", avatar: IMAGES.userAvatar },
    text: "Bu epizod juda ajoyib! Oxiridagi twist kutilmagan edi 🔥",
    likes: 142,
    time: "2 soat oldin",
  },
  {
    id: "cm2",
    user: { name: "KDrama_Lover", avatar: IMAGES.castActor2 },
    text: "Aktyorlar o'yini aql bovar qilmas darajada yaxshi. Har bir sahna mukammal!",
    likes: 98,
    time: "5 soat oldin",
  },
  {
    id: "cm3",
    user: { name: "SeoulVibes", avatar: IMAGES.castActor1 },
    text: "Subtitrlar uchun katta rahmat! Sifati zo'r 👏",
    likes: 67,
    time: "1 kun oldin",
  },
];

/* ─── Mock Admin Data ─── */
export const adminDramas: AdminDrama[] = [
  { id: "1", title: "The Night Watchman's Secret", status: "Published", episodes: 8, views: "2.4M", rating: 9.6, lastUpdated: "2024-01-15" },
  { id: "2", title: "Surgeon's Code", status: "Published", episodes: 8, views: "1.8M", rating: 9.2, lastUpdated: "2024-01-14" },
  { id: "3", title: "The Crimson Crown", status: "Draft", episodes: 2, views: "0", rating: 0, lastUpdated: "2024-01-13" },
  { id: "4", title: "Neon Echoes", status: "Published", episodes: 2, views: "900K", rating: 9.0, lastUpdated: "2024-01-12" },
  { id: "5", title: "Alchemy of Souls", status: "Published", episodes: 8, views: "5.2M", rating: 9.4, lastUpdated: "2024-01-10" },
];

export const adminStats = {
  totalDramas: 24,
  totalEpisodes: 312,
  totalUsers: "45.2K",
  totalViews: "12.8M",
  activeUsers: "8.3K",
  newUsersToday: 234,
};
