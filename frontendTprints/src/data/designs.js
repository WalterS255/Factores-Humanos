export const designs = [
  {
    id: 'america',
    title: 'América',
    subtitle: 'Escudo clásico bordado',
    status: 'Aprobada',
    statusTone: 'green',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuABebR6mlHERikWIJQq7xTlZEiaWXJSCscoZ_RcnEhLbYSg5Idt-pncsw-fKkI9KqQYyaf4ownGFFnYTtIGLzh6ip3Og3tYCJUqrs_wE2eSDhkCyVw6RC5NxM6a0YrovRNbqFG2r_ccMjWd5p3nKaANX_X1kmGSe0XQaUvVGZH7ZwTJy5cLYVLaBOYiQGBtzk_nj214c9XNzsVkZKzS5mLJ0tqjLjlonkKli87gynz7DIQfQjMPaUFMvFhwnB1JNr90NlqHlDvm70v7',
  },
  {
    id: 'cali',
    title: 'Cali',
    subtitle: 'Versión digital premium',
    status: 'Aprobada',
    statusTone: 'green',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDY8p3ThV03Xw8J_BZqf2yLo03a2f-bzLmNLkB5IOO14DlbOWQpogDiAl8wNo-rIkFEXeqVY2jS3uA9xf6XEu2u3nBeQqbRBS-8t6ukcNQw6RHO2-OlUX9NrDd9djVAzecNgrbtA3YUayge_NzAqNZ5jbaz2mLburDzsF8utMijDLxCaLnilLnjBwXUwVVVs12dfVs5pFf79ozHHmRN0ShlCRSm3vixRXHAec-5WnxxW4lpam5P52ddeYH7hOoyqSqZcsB8vl-qptLm',
  },
  {
    id: 'millonarios',
    title: 'Millonarios',
    subtitle: 'Logo aniversario dorado',
    status: 'Pendiente',
    statusTone: 'orange',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGV6e51yO2IPlVJlMtyOvg-bxwp8yKEHLqGg9l__g4zg-SmWaDF14DfPNPkgMCfbpCAFSsHJo0Iceud7I6uoKaSOeo199iCiomrEPTTPRKRX3KOaSOrUucpJENUr25nJWwpzC4uDCELTawz6zvMbI0xT0kI-1KUt8J1wg0lSdbGrV4-SFM1RQ0yHSngG49ZApR-xpi7XIx01Umf2oNtB8veF6-Rf-IOXtPZXv8Ln5jI2ODeRzofoLCdU18KmEG1XeiRRbmNR55vT3t',
  },
  {
    id: 'nacional',
    title: 'Nacional',
    subtitle: 'Escudo con estrellas',
    status: 'Aprobada',
    statusTone: 'green',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBmP9e4-2cHNlZwrD27Wtr4FBEUm4B-8p2PAtVVAAA3nF4rxkZ-b6GGVuH5OMSS7o-n8DWna8qI4VEsTTOMZA0Q-3FEK8BHntC7ohFjx-M4l07b1Xddrf9adqZOyNnV_GNOgg2UY8n-6U_9oo3eTOuO9akLNt0Ox0p3F1-7kg8vErD_uRDfS8sHMZuIvOKJ8g8jgpYzpqkLERp983m_wmvfgnEE6yN7L952ucmRqLLCfYtYz7aoEdUgVjzS2LcIa7A5gPFNqkKYAfUr',
  },
  {
    id: 'santafe',
    title: 'Santa Fe',
    subtitle: 'León rampante minimalista',
    status: 'Pendiente',
    statusTone: 'orange',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCzoYuu0W7FXQyVIGG0y9ksCnSAKUOrmAAyD_neit5pXlfljcKtn8izFKWiHiCOpviIJnokC8Zo-eZwlPGjz1XGf8DscmbWV6glGoUQ75z5juaP85l4VpHRHjB7g7N3vXMpgM5uwlYFHzoEr4fEQO5Wu4wftDc_rkA5fAxBp1BQQC6SHd06peBVOxsZ4ShmrzoTgikfUa7Nwa6GJg1VGqLPvotKYd0ctwbk-SqS4RQcd568HaZxjvuYro9Ki1lX6G_rRd2YZdPJFlDi',
  },
  {
    id: 'junior',
    title: 'Junior',
    subtitle: 'Escudo con 10 estrellas',
    status: 'Aprobada',
    statusTone: 'green',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBrevdIikPPQvXWDG7ItNSb0TGxIDq2OOd9YQxrp2EjC3ZlizBL5SpL_4TiBxBqZYRJRT2kZ35N5dgyWp2q5UvgdnpfBJe4aRuTBIi8dzT3z_Q6hnfbtFO_2eyzFqvla8FsQtbEy59pvhusU0ewDmWFd7D0d6elKZmXl3cci6irYqQoQhyth6GszQX7KrIaRRidxgaUzKn94OP8mWV6aApG4kweoEYqLASgeS8dkyz5W6VYQtNZVOtmEUjmhYUEfUPXiFMFM-r9C5wU',
  },
]

export function getStatusBadgeClasses(tone) {
  if (tone === 'green') {
    return {
      wrapper: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
    }
  }

  return {
    wrapper: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
  }
}
