var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '555421',
  key: '2bae7f804ef1483a7795',
  secret: '6fb52823189341c662a5',
  cluster: 'ap1',
  encrypted: true
});

pusher.trigger('my-channel', 'my-event', {
  "message": "hello world"
});
