const chatData = [
    {
      _id: 1,
      text: 'Xin chào!',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Người Gửi 1',
        avatar: require('../assets/logo1.png'),
      },
    },
    {
      _id: 2,
      text: 'Chào bạn!',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Người Gửi 2',
        avatar: require('../assets/logo2.png'),
      },
    },
    {
      _id: 3,
      text: 'Bạn đang làm gì?',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Người Gửi 1',
        avatar: require('../assets/logo1.png'),
      },
    },
    {
      _id: 4,
      text: 'Tôi đang xem một bộ phim.',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Người Gửi 2',
        avatar: require('../assets/logo2.png'),
      },
    },
    {
      _id: 5,
      text: 'Đó là bộ phim gì?',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Người Gửi 1',
        avatar: require('../assets/logo1.png'),
      },
    },
    {
      _id: 6,
      text: 'Bộ phim có tên là "The Great Adventure".',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Người Gửi 2',
        avatar: require('../assets/logo2.png'),
      },
    },
    {
      _id: 7,
      text: 'Nghe có vẻ thú vị!',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'Người Gửi 1',
        avatar: require('../assets/logo1.png'),
      },
    },
  ];
  
  export default chatData;
  