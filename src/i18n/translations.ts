import type { Language } from './LanguageContext'

export type Translations = {
  languageSwitcher: {
    label: string
  }
  navbar: {
    home: string
    about: string
    services: string
    projects: string
    references: string
    contact: string
  }
  hero: {
    badge: string
    titleLine1: string
    titleLine2: string
    paragraph: string
  }
  about: {
    eyebrow: string
    heading: string
    paragraph: string
    emblemAlt: string
    whyHeading: string
    whyParagraph: string
    features: string[]
  }
  surveyNetwork: {
    yearsExperience: string
    completedProjects: string
    internationalProjectHeadline: string
    internationalProjectLabel: string
  }
  services: {
    eyebrow: string
    heading: string
    paragraph: string
  }
  projects: {
    eyebrow: string
    headingLine1: string
    headingLine2: string
    projectLabel: string
    projectType: string
    location: string
    servicesLabel: string
    prevImage: string
    nextImage: string
    showImage: (index: number) => string
    closeProject: string
    closeFullscreen: string
    openProjectAria: (title: string) => string
    projectDetailAria: (title: string) => string
    viewPointCloud: string
    pointCloudHint: string
  }
  pointCloud: {
    eyebrow: string
    preparing: string
    loading: string
    loadError: string
    parseError: string
    pointSize: string
    resetView: string
    openFile: string
    close: string
    pointCount: (count: number) => string
    dialogAria: (title: string) => string
  }
  references: {
    eyebrow: string
    heading: string
    paragraph: string
  }
  contact: {
    eyebrow: string
    heading: string
    paragraph: string
    mapTitle: string
    openInMaps: string
    address: { label: string; content: string[] }
    phone: { label: string }
    email: { label: string }
    hours: { label: string; content: string[] }
  }
  footer: {
    quickLinksHeading: string
    contactHeading: string
    homeAria: string
    copyright: string
    address: string
  }
}

export const tr: Translations = {
  languageSwitcher: {
    label: 'Dil',
  },
  navbar: {
    home: 'Ana Sayfa',
    about: 'Hakkımızda',
    services: 'Hizmetler',
    projects: 'Projeler',
    references: 'Referanslar',
    contact: 'İletişim',
  },
  hero: {
    badge: 'Harita ve Mühendislik Hizmetleri',
    titleLine1: 'Harita Mühendisliğinde',
    titleLine2: 'Güvenilir Çözüm Ortağınız.',
    paragraph:
      'BEHA, harita mühendisliği, ölçme, aplikasyon ve mühendislik hizmetlerinde güvenilir, doğru ve profesyonel çözümler sunar.',
  },
  about: {
    eyebrow: 'Hakkımızda',
    heading: 'Harita Mühendisliğinde Güvenilir Çözüm Ortağınız',
    paragraph:
      'BEHA, her projeye titiz planlama ve doğru ölçüm yaklaşımıyla değer katar. Deneyimli ekibimiz, güncel teknolojilerle güvenilir sonuçlar üretirken iş ortaklarımızın ihtiyaçlarını dikkatle dinler. Sürdürülebilir ve şeffaf hizmet anlayışımızla, projelerinizi güvenle geleceğe taşırız.',
    emblemAlt: 'BEHA amblemi',
    whyHeading: 'Neden BEHA?',
    whyParagraph:
      'Projelerinizin her aşamasında teknik doğruluk, açık iletişim ve zamanında teslim ilkeleriyle yanınızdayız. İhtiyaçlarınıza özel çözümler üreterek güvenilir bir iş ortaklığı kuruyoruz.',
    features: ['Modern Teknoloji', 'Deneyimli Ekip', 'Hassas Ölçüm', 'Güvenilir Hizmet'],
  },
  surveyNetwork: {
    yearsExperience: 'Yıllık Deneyim',
    completedProjects: 'Tamamlanan Proje',
    internationalProjectHeadline: 'Uluslararası Proje',
    internationalProjectLabel: 'Deneyimi',
  },
  services: {
    eyebrow: 'HİZMETLERİMİZ',
    heading: 'Profesyonel Harita ve Mühendislik Hizmetleri',
    paragraph: 'Projelerinizin her aşamasına uygun, doğru veriye dayalı ve güvenilir mühendislik çözümleri sunuyoruz.',
  },
  projects: {
    eyebrow: 'PROJELERİMİZ',
    headingLine1: 'Tamamladığımız Bazı',
    headingLine2: 'Çalışmalar',
    projectLabel: 'PROJE',
    projectType: 'Proje Türü',
    location: 'Konum',
    servicesLabel: 'Hizmetler',
    prevImage: 'Önceki görsel',
    nextImage: 'Sonraki görsel',
    showImage: (index: number) => `${index}. görseli göster`,
    closeProject: 'Projeyi kapat',
    closeFullscreen: 'Tam ekran görüntüyü kapat',
    openProjectAria: (title: string) => `${title} projesini aç`,
    projectDetailAria: (title: string) => `${title} proje detayı`,
    viewPointCloud: '3B Nokta Bulutunu Görüntüle',
    pointCloudHint: 'Sol tık döndürür, sağ tık kaydırır, tekerlek yakınlaştırır.',
  },
  pointCloud: {
    eyebrow: 'NOKTA BULUTU',
    preparing: '3B görüntüleyici hazırlanıyor…',
    loading: 'Nokta bulutu yükleniyor…',
    loadError: 'Nokta bulutu yüklenemedi.',
    parseError: 'Dosya okunamadı. Geçerli bir .ply dosyası seçin.',
    pointSize: 'Nokta Boyutu',
    resetView: 'Görünümü Sıfırla',
    openFile: 'Dosya Aç',
    close: 'Görüntüleyiciyi kapat',
    pointCount: (count: number) => `${count.toLocaleString('tr-TR')} nokta`,
    dialogAria: (title: string) => `${title} 3B nokta bulutu görüntüleyici`,
  },
  references: {
    eyebrow: 'REFERANSLARIMIZ',
    heading: 'Güvenle Birlikte Çalıştığımız Kurumlar',
    paragraph: 'Farklı sektörlerdeki iş ortaklarımızla güvene dayalı, uzun soluklu ve başarılı projeler yürütüyoruz.',
  },
  contact: {
    eyebrow: 'İLETİŞİM',
    heading: 'Bizimle İletişime Geçin',
    paragraph:
      'Projeleriniz ve hizmetlerimiz hakkında bilgi almak için ekibimizle dilediğiniz zaman iletişime geçebilirsiniz.',
    mapTitle: 'BEHA İnşaat konumu',
    openInMaps: "Google Maps'te Aç →",
    address: {
      label: 'Adres',
      content: ['Ceyhun Atuf Kansu Cad.', '1244. Sok. No:6/1', 'Çankaya / Ankara'],
    },
    phone: { label: 'Telefon' },
    email: { label: 'E-posta' },
    hours: {
      label: 'Çalışma Saatleri',
      content: ['Pazartesi - Cuma', '09:00 – 18:00'],
    },
  },
  footer: {
    quickLinksHeading: 'Hızlı Bağlantılar',
    contactHeading: 'İletişim',
    homeAria: 'BEHA ana sayfa',
    copyright: '© 2026 BEHA Harita Mühendislik. Tüm hakları saklıdır.',
    address: 'Ceyhun Atuf Kansu Cad., Balgat / Ankara',
  },
}

export const en: Translations = {
  languageSwitcher: {
    label: 'Language',
  },
  navbar: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    projects: 'Projects',
    references: 'References',
    contact: 'Contact',
  },
  hero: {
    badge: 'Surveying and Engineering Services',
    titleLine1: 'Your Reliable Partner in',
    titleLine2: 'Surveying & Engineering',
    paragraph:
      'BEHA delivers reliable, accurate, and professional solutions in surveying, measurement, staking, and engineering services.',
  },
  about: {
    eyebrow: 'About Us',
    heading: 'Your Reliable Partner in Surveying and Engineering',
    paragraph:
      "BEHA adds value to every project through meticulous planning and precise measurement. Our experienced team delivers reliable results with up-to-date technology while carefully listening to our partners' needs. With a sustainable and transparent approach to service, we carry your projects confidently into the future.",
    emblemAlt: 'BEHA emblem',
    whyHeading: 'Why BEHA?',
    whyParagraph:
      'We stand by you at every stage of your project with technical accuracy, open communication, and on-time delivery. We build a reliable partnership by creating solutions tailored to your needs.',
    features: ['Modern Technology', 'Experienced Team', 'Precise Measurement', 'Reliable Service'],
  },
  surveyNetwork: {
    yearsExperience: 'Years of Experience',
    completedProjects: 'Completed Projects',
    internationalProjectHeadline: 'International Project',
    internationalProjectLabel: 'Experience',
  },
  services: {
    eyebrow: 'OUR SERVICES',
    heading: 'Professional Surveying and Engineering Services',
    paragraph: 'We provide reliable engineering solutions based on accurate data, suited to every stage of your projects.',
  },
  projects: {
    eyebrow: 'OUR PROJECTS',
    headingLine1: 'Some of Our',
    headingLine2: 'Completed Works',
    projectLabel: 'PROJECT',
    projectType: 'Project Type',
    location: 'Location',
    servicesLabel: 'Services',
    prevImage: 'Previous image',
    nextImage: 'Next image',
    showImage: (index: number) => `Show image ${index}`,
    closeProject: 'Close project',
    closeFullscreen: 'Close fullscreen view',
    openProjectAria: (title: string) => `Open ${title} project`,
    projectDetailAria: (title: string) => `${title} project detail`,
    viewPointCloud: 'View 3D Point Cloud',
    pointCloudHint: 'Left-drag to orbit, right-drag to pan, scroll to zoom.',
  },
  pointCloud: {
    eyebrow: 'POINT CLOUD',
    preparing: 'Preparing the 3D viewer…',
    loading: 'Loading point cloud…',
    loadError: 'The point cloud could not be loaded.',
    parseError: 'The file could not be read. Please choose a valid .ply file.',
    pointSize: 'Point Size',
    resetView: 'Reset View',
    openFile: 'Open File',
    close: 'Close viewer',
    pointCount: (count: number) => `${count.toLocaleString('en-US')} points`,
    dialogAria: (title: string) => `${title} 3D point cloud viewer`,
  },
  references: {
    eyebrow: 'OUR REFERENCES',
    heading: 'Institutions We Work With, Built on Trust',
    paragraph: 'We carry out trust-based, long-term, and successful projects with our partners across different sectors.',
  },
  contact: {
    eyebrow: 'CONTACT',
    heading: 'Get in Touch With Us',
    paragraph: 'You can reach out to our team anytime for information about your projects and our services.',
    mapTitle: 'BEHA İnşaat location',
    openInMaps: 'Open in Google Maps →',
    address: {
      label: 'Address',
      content: ['Ceyhun Atuf Kansu Cad.', '1244. Sok. No:6/1', 'Çankaya / Ankara'],
    },
    phone: { label: 'Phone' },
    email: { label: 'Email' },
    hours: {
      label: 'Working Hours',
      content: ['Monday - Friday', '09:00 – 18:00'],
    },
  },
  footer: {
    quickLinksHeading: 'Quick Links',
    contactHeading: 'Contact',
    homeAria: 'BEHA home page',
    copyright: '© 2026 BEHA Harita Mühendislik. All rights reserved.',
    address: 'Ceyhun Atuf Kansu Cad., Balgat / Ankara',
  },
}

export const translations: Record<Language, Translations> = { tr, en }
