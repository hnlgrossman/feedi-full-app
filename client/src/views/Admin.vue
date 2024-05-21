<template>
  <div id="main_admin" v-if="user?._id || $route.name === 'admin_login'">
    <header v-if="$route.name !== 'admin_login'">
        <div class="hamburger" @click="sideBarOpen = true">
            <div class="open" v-if="sideBarOpen"><i class="fas fa-times"></i></div>
            <div class="close" v-else><i class="fas fa-bars"></i></div>
        </div>
        <router-link :to="{name: 'admin'}" class="logo_small"></router-link>
    </header>
    <SideBar :active="sideBarOpen" @close="sideBarOpen=false" :user="user" />
    <div id="admin_content">
        <router-view :user="user" ></router-view>
    </div>
  </div>
</template>

<script>
import SideBar from '@/components/admin/sideBar.vue';

// import jwt_decode from 'jwt-decode';

export default {
    components: {SideBar},
    data() {
        return {
            sideBarOpen: false,
            user: null,
            
        }
    },
    mounted() {
        // this.translate()
        if (localStorage.getItem('user_token')) {
            const tokenData = this.decodeJwtToken(localStorage.getItem('user_token'));
            if (!tokenData) return false;
            this.api({ action: 'user/' + tokenData._id, data: {}, method: 'get'}, 
                (data) => {
                    if (data) {
                        this.user = data;
                    } else  { this.$router.push({ name: 'admin_login'})}
                }, (error) => {
                    if (error.data === "not found") {
                        this.$router.push({ name: 'admin_login'})
                    }
                    this.$router.push({ name: 'admin_login'})
                }
            )
            
        } else {
            this.$router.push({ name: 'admin_login'})
        }
    },
    methods: {
//         async translate(sourceText) {
//     try {
//       const sourceLang = 'he'; // Hebrew language code
//       const targetLang = 'ru'; // Russian language code
//       const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(sourceText)}`;
  
//       const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error('Translation request failed');
//     }
//     const data = await response.json();
//     console.log(data[0][0][0]);
//     return data[0][0][0];
//     } catch (error) {
//       console.error('Error translating:', error);
//       return null;
//     }
//   }
    }
}
</script>

<style lang="scss">
#main_admin { position: relative; 
    header { padding-block: 10px; position: sticky; top: 0; background: #f9f9f9; box-shadow: var(--shadow); height: var(--headerHeight); display: flex; align-items: center; justify-content: space-between; padding-inline: var(--gap); 
        .hamburger { cursor: pointer ; 
            i, svg { font-size: 22px;  }
        }
        .logo_small { background-image: url('@/assets/logo_small.svg'); background-size: contain; background-repeat: no-repeat;aspect-ratio: 16 / 6;
    height: 100%; }
    }
    
    #admin_content {
        // padding-top: var(--headerHeight);
    
    }
}
</style>