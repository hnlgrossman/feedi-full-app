<template>
  <div id="feedbacks_page">
    <div class="filters">
        <!-- <div class="status_filter">
            <label for="statusSelect"></label>
            <select id="statusSelect" v-model="selectedStatusFilter">
                <option :value="status.value" v-text="status.name" :key="status.value" v-for="status in filterStatus"></option>
            </select>
        </div>
        <div class="date_filter">
            <label for="dateInput">תאריך</label>
            <input type="date" id="dateInput" v-model="selectedDateFilter">
        </div> -->
    </div>

    <div class="btn" @click="getExcel">הורד אקסל</div>

    <ul></ul>
  </div>
</template>

<script>
export default {
    props: ['user'],
    data() {
        return {
            filterStatus: [
                { name: 'לא טופל', value: '1'},
                { name: 'בטיפול', value: '2'},
                { name: 'טופל', value: '3'},
            ],
            selectedStatusFilter: '',
            selectedDateFilter: '',
            feedbacks: []
        }
    },
    mounted() {
        this.api({ action: 'feedback?user_id=' + this.user._id, data: {}, method: 'get'}, 
            (data) => {
                if (data) {
                    this.feedbacks = data;
                }
            }, (error) => {
                console.error(error.data, 'hnl');
            }
        )
    },
    methods: {
        getExcel() {
            this.api({action: 'feedback/get_feedbacks_excel', data: {}, method: 'get'},
            (data) => {
                if (data?.url) {
                    this.downloadFileFromUrl(data.url, 'feedbacks_report.xlsx')
                }
            }, (error) => {
                console.error(error.data);
            })
        }
    }
}
</script>

<style lang="scss">
#feedbacks_page {
    .btn { margin: 0 auto; margin-top: 100px;}

}
</style>