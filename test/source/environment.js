var environments = array('http://localhost:3000/');
var username = 'bhiuvad@gmail.com';
var password = 'Koph4iem132';
var apis = [
    {
        'name': 'authorize',
        'path':'authorize',
        'method': 'GET',
        'query': {
            'username': username,
            'password': password
        }        
    },
    {
        'name': 'login',
        'path':'login',
        'method': '',
        'query': {
            'username': username,
            'password': password
        }        
    },
];