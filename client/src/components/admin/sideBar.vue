<template>

  <div id="side_bar" >

        <div class="side_bar_container"  v-click-away="() => { $emit('close')  }" >
            <router-link @click="$emit('close')" :to="{ name: 'admin'}" class="logo"></router-link>
            <ul>
                <router-link @click="$emit('close')" v-bind="link?.bind" v-for="(link, i) in sideBarMenu" :to="link.to" :key="i">
                    <div class="icon_fa"><i :class="link.fa_icon"></i></div>
                    <span v-text="link.name"></span>
                </router-link>
                <a v-if="user?.qr_code" @click="downloadFileFromUrl(user?.qr_code, 'qr_code.png')">
                    <div class="icon_fa"><i class="fas fa-qrcode"></i></div>
                    <span >qr code</span>
                </a>
                <a @click="logout" >
                    <div class="icon_fa"><i class="fa-solid fa-right-from-bracket"></i></div>
                    <span >התנתק</span>
                </a>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: ['user'],
    data() {
        return {
            sideBarMenu: [
                { name: 'עריכת טופס',  fa_icon: "fab fa-wpforms", to: { name: 'edit_form'}},
                { name: 'פרטים כלליים',  fa_icon: "fas fa-cog", to: { name: 'additional_data'}},
                { name: 'פידבקים',  fa_icon: "far fa-comment-dots", to: { name: 'feedbacks'}},
                
            ]
        }
    },
    mounted() {
        this.sideBarMenu.push({ name: 'קישור (זמני)',  fa_icon: "fas fa-link", to: { name: 'review', params: {user_id: this.user?._id}}, bind: { target: '_blank'}})
        if (this.user?.userType === "admin") {
            this.sideBarMenu.push({ name: 'ניהול משתמשים',  fa_icon: "fas fa-users-cog", to: { name: 'users_manager'}})
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss">
#side_bar {
    &>div { z-index: 10;}
    // transform: translateX(100%);
        &::after { z-index: 9; content: '';height: 100vh   ; position: absolute; inset: 0px;background: rgba(100, 100, 100, 0.2);  }
        &.slide-enter-to {
            // .side_bar_container { transform: translateX(100%); }
        }
        // &.active { 
        //     &::after {  pointer-events: all; background: rgba(100, 100, 100, 0.2);  }
        //     .side_bar_container { transform: translateX(0%); }
        // }
        // &::after {  content: ''; pointer-events: none; background: rgba(100, 100, 100, 0); position: absolute; inset: 0px; transition: 0.3s all; }
        
        .side_bar_container {  position: fixed; right: -1px; top: 0; bottom: 0;  width: 70%;border-top-left-radius: var(--radius);
            // transform: translateX(100%); transition: 0.3s all;
    border-bottom-left-radius: var(--radius);background: linear-gradient(90deg, var(--color_bolder), var(--color)); padding: var(--padding_inline);  display: flex; flex-direction: column; gap: var(--gap_xl); }
        .logo { width: 80%; aspect-ratio: 16 / 9; background: #fff; margin: 0 auto; }
        ul { display: flex; flex-direction: column; gap: var(--gap_small);  
            a { display: flex; align-items: center; gap: var(--gap_small); background: transparent; border-radius: var(--radius_small); color: #fff; text-decoration: none; font-size: var(--h5); padding: var(--gap_small); 
                &.router-link-exact-active { background: #84bb87;}
                i, svg { font-size: 22px;}
                span { font-size: var(--h4);}
            }
        }
    }
</style>