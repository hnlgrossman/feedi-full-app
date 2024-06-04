import VueJwtDecode from 'vue-jwt-decode'

const globalMixin = {
    data() {
      const host_url = window.host_url; 
        return {
          user_admin: null,
          host_url,
          
        }
    },
    methods: {
      getLang(obj, lang, key='text') {
        if (obj && obj[key]) {
          if (lang === 'en') return obj[key + 'En'];
          if (lang === 'ru') return obj[key + 'Ru'];
          if (lang === 'ro') return obj[key + 'Ro'];
          else return obj[key];
        }
        return '';
      },
      array_move(arr, old_index, new_index) {
          if (new_index >= arr.length) {
              var k = new_index - arr.length + 1;
              while (k--) {
                  arr.push(undefined);
              }
          }
          arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
          return arr; // for testing
      },
      getPic(picName) {
        return picName;
        // return this.host_url + 'uploads/' + picName
      },
      logout() {
        window.localStorage.setItem('user_token', '')
        window.location.reload()
      },
        api(settings, func, failFunc){
            if (!func) func = function(){};
        
             var headers = {
               'Content-Type': 'application/json; charset=utf-8',
             };
    
             if(localStorage.getItem('user_token'))
             { 
               headers.Authorization = localStorage.getItem('user_token');
             }
            //  headers.platform = (window.location.hostname == 'localhost' ? '' : window.location.hostname);
    
    //       var requestOBJ;
    
               if (settings.method == 'get')
               {
                  let actionGet = settings.action;
                  // actionGet = actionGet + (actionGet.indexOf('?') === -1 ? '?' : '&');
                  // actionGet = actionGet + 'ts='  + (new Date()).getHours() + '_' + ((new Date()).getMinutes() < 30 ? '0' : '30');
    
                  if (settings.data)
                  { 
                    for (let i in settings.data) actionGet += '&' + i + '=' + settings.data[i];
                  }
    
                   this.axios.get(window.api_url + actionGet, { headers: headers } ).then(response => {
                    // this.alert(response.data)
                    if (response.data == 'auth-error')
                    {
                    //   this.set_user_token('');
                      localStorage.setItem('user_token', null);
                      window.location.reload();
                    //   this.$bus.$emit('reload', '/');
                    }
                    else func(response.data);
                 }, response => { 
                 
                   if (failFunc) failFunc(response);
                   else func(false);
                 });
                 
    
               }
               else if (settings.method === 'delete') {
                
                this.axios.delete(window.api_url + settings.action, { data: settings.data,  headers: headers })
                .then(response => { 
                  if (response.data == 'error')
                  {
                    // this.set_user_token('');
                    // this.$bus.$emit('reload', '/');
                  }
                  else if (response.data.data == 'PERMS')
                  {
                    this.alert('אין לי הרשאה לעמוד הנוכחי');
                  }
                  else func(response.data);
                     //console.log(response.body);
                })
                .catch(response => { 
                  if (failFunc) failFunc(response.response);
                })
               }
               else
               {
                this.axios[settings.method](window.api_url + settings.action, settings.data, { headers: headers })
                .then(response => { 
                  if (response.data == 'error')
                  {
                    // this.set_user_token('');
                    // this.$bus.$emit('reload', '/');
                  }
                  else if (response.data.data == 'PERMS')
                  {
                    this.alert('אין לי הרשאה לעמוד הנוכחי');
                  }
                  else func(response.data);
                     //console.log(response.body);
                })
                .catch(response => { 
                  if (failFunc) failFunc(response.response);
                })

             }
             
            return true;
        
        },
        decodeJwtToken(token) {
          return VueJwtDecode.decode(token)
        }
    }
}

export default globalMixin;