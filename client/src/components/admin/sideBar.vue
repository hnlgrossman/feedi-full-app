<template>

  <div v-if="$route.name !== 'admin_login'" id="side_bar" :class="{ active: active}">

        <div class="side_bar_container"  v-click-away="() => { active ? $emit('close') : null }" >
            <router-link @click="$emit('close')" :to="{ name: 'admin'}" class="logo"></router-link>
            <ul>
                <router-link @click="$emit('close')" v-bind="link?.bind" v-for="(link, i) in sideBarMenu" :to="link.to" :key="i">
                    <div class="icon_fa"><i :class="link.fa_icon"></i></div>
                    <span v-text="link.name"></span>
                </router-link>
                <a v-if="user?.qr_code" @click="downloadImage(user?.qr_code, 'qr_code.png')">
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
    props: ['active', 'user'],
    data() {
        return {
            sideBarMenu: [
                { name: 'עריכת טופס',  fa_icon: "fab fa-wpforms", to: { name: 'edit_form'}},
                { name: 'פידבקים',  fa_icon: "far fa-comment-dots", to: { name: 'feedbacks'}},
                
            ]
        }
    },
    mounted() {
        this.sideBarMenu.push({ name: 'קישור (זמני)',  fa_icon: "fas fa-link", to: { name: 'review', params: {user_id: this.user?._id}}, bind: { target: '_blank'}})
        if (this.user?.userType === "admin") {
            this.sideBarMenu.push({ name: 'הוספת משתמש',  fa_icon: "fa-solid fa-user-tie", to: { name: 'add_users'}})
        }
    },
    methods: {
        async downloadImage(url, filename) {
            try {
                const response = await fetch(url, {
                    mode: 'cors' // Ensure the server allows cross-origin requests
                });
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);

                // Create a new anchor element
                const a = document.createElement('a');
                a.href = objectURL;
                a.download = filename;

                // Append the anchor to the body (required for Firefox)
                document.body.appendChild(a);

                // Trigger a click event on the anchor to start the download
                a.click();

                // Clean up by revoking the object URL and removing the anchor element
                URL.revokeObjectURL(objectURL);
                document.body.removeChild(a);
            } catch (error) {
                console.error('Failed to download image', error);
            }
        }
    }
}
</script>

<style lang="scss">
#side_bar {
        &.active { 
            &::after {  pointer-events: all; background: rgba(100, 100, 100, 0.2);  }
            .side_bar_container { transform: translateX(0%); }
        }
        &::after {  content: ''; pointer-events: none; background: rgba(100, 100, 100, 0); position: absolute; inset: 0px; transition: 0.3s all; }
        .side_bar_container { z-index: 1 ; transition: 0.3s all;  position: fixed; right: -1px; top: 0; bottom: 0;  transform: translateX(100%); width: 70%;border-top-left-radius: var(--radius);
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