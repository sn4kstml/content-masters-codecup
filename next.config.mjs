export default {
    async rewrites() {
      return [
        {
          source: '/api/search',
          destination: 'https://xmlriver.com/search_yandex/xml?key=964a19340e7e6db6090df8471e05f27a19f7e38e&user=15305',
        },
      ]
    },
  };