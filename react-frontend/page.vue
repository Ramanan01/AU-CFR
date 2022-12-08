<template>
  <div id="app">
    <b-container fluid>
      <b-row>
        <b-col class="full-height" cols="3" style="padding: 5px">
          <table>
            <tr>
              <td>
                <b>ID {{ data.app_gen_id }}, {{ data.name }}</b>
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px" class="font-weight-bold">
                Title {{ data.title }}
              </td>
            </tr>
          </table>

          <!-- <span style="font-size: 12px;" ng-if="data">
            <b>{{ data.supervisor.name }}</b
            >, {{ data.supervisor.dept }},
            {{ data.supervisor.org }}
          </span> -->
          <hr style="margin:0" />

          <b-card
            v-for="dc in data.dc_members"
            :key="dc.id"
            :title="dc.name"
            :sub-title="`${dc.designation}, ${dc.dept}, ${dc.org}`"
            style="margin-bottom: 5px;"
            footer-tag="footer"
            v-bind:class="{
              active: selectedIndex === dc.id,
              selected: selectedDCMember === dc.name,
            }"
            @click="goToMember(dc)"
          >
            <b-card-text>
              <!-- {{ dc.address }} -->
            </b-card-text>
            <template #footer>
              <span
                class="float-right badge badge-primary font-weight-bold"
                style="font-size: 13px;"
              >
                {{ dc.score }}
              </span>
            </template>
          </b-card>
          <hr />
          <b-card
            v-for="dc in data.dco_members"
            :key="dc.id"
            :title="dc.name"
            :sub-title="`${dc.designation}, ${dc.dept}, ${dc.org}`"
            style="margin-bottom: 5px;"
            footer-tag="footer"
            v-bind:class="{
              active: selectedIndex === dc.id,
              selected: selectedDCOMember === dc.name,
            }"
            @click="goToMember(dc)"
          >
            <b-card-text>
              <!-- {{ dc.address }} -->
            </b-card-text>
            <template #footer>
              <span
                class="float-right badge badge-primary font-weight-bold"
                style="font-size: 13px;"
              >
                {{ dc.score }}
              </span>
            </template>
          </b-card>
          <b-button @click="saveSelection()" variant="outline-success"
            >Save and Load Next</b-button
          > &nbsp; <b>({{data.progress.done}} / {{data.progress.total}})</b>
        </b-col>
        <b-col class="full-height" cols="9">
          <VueSlickCarousel
            style="height: 95%"
            :arrows="false"
            :dots="false"
            ref="carousel"
            :speed="50"
          >
            <div class="full-height">
              <embed
                v-if="data.dc_members"
                width="100%"
                height="100%"
                :src="
                  `${apiUrl}/pdfs/${data.app_gen_id}_${data.dc_members[0].id}.pdf`
                "
              />
            </div>
            <div class="full-height">
              <embed
                v-if="data.dc_members"
                width="100%"
                height="100%"
                :src="
                  `${apiUrl}/pdfs/${data.app_gen_id}_${data.dc_members[1].id}.pdf`
                "
              />
            </div>
            <div class="full-height">
              <embed
                v-if="data.dc_members"
                width="100%"
                height="100%"
                :src="
                  `${apiUrl}/pdfs/${data.app_gen_id}_${data.dc_members[2].id}.pdf`
                "
              />
            </div>
            <div class="full-height">
              <embed
                v-if="data.dc_members"
                width="100%"
                height="100%"
                :src="
                  `${apiUrl}/pdfs/${data.app_gen_id}_${data.dco_members[0].id}.pdf`
                "
              />
            </div>
            <div class="full-height">
              <embed
                v-if="data.dc_members"
                width="100%"
                height="100%"
                :src="
                  `${apiUrl}/pdfs/${data.app_gen_id}_${data.dco_members[1].id}.pdf`

                "
              />
            </div>
            <div class="full-height">
              <embed
                v-if="data.dc_members"
                width="100%"
                height="100%"
                :src="
                  `${apiUrl}/pdfs/${data.app_gen_id}_${data.dco_members[2].id}.pdf`
                "
              />
            </div>
          </VueSlickCarousel>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
import axios from "axios";

const baseUrl = "http://localhost:5000/api/expert/next?offset=0"

export default {
  name: "App",
  components: {
    VueSlickCarousel,
  },
  data() {
    return {
      apiUrl: baseUrl,
      data: {
        supervisor: {},
        progress: {}
      },
      selectedMember: null,
      selectedIndex: 1,
      selectedDCMember: null,
      selectedDCOMember: null,
    };
  },
  methods: {
    showNext() {
      this.$refs.carousel.next();
      if (this.selectedIndex == 6) {
        this.selectedIndex = 1;
      } else {
        this.selectedIndex += 1;
      }
    },
    // showPrev() {
    //   this.$refs.carousel.prev();
    //   if (this.selectedIndex == 1) {
    //     this.selectedIndex = 6;
    //   } else {
    //     this.selectedIndex += -1;
    //   }
    // },
    loadNextMember() {
      axios.get(`${baseUrl}`).then((res) => {
        this.data = res.data;
        console.log("data->", this.data);
        // select first by default
        this.selectedMember = this.data.dc_members[0];
      });
    },
    // selectMember() {
    //   if ([1, 2, 3].indexOf(this.selectedMember.id) > -1) {
    //     if (this.selectedDCMember === this.selectedMember.name) {
    //       this.selectedDCMember = null;
    //     } else {
    //       this.selectedDCMember = this.selectedMember.name;
    //     }
    //   } else {
    //     if (this.selectedDCOMember === this.selectedMember.name) {
    //       this.selectedDCOMember = null;
    //     } else {
    //       this.selectedDCOMember = this.selectedMember.name;
    //     }
    //   }
    // },
    // saveSelection() {
    //   axios
    //     .post(`${baseUrl}/select`, {
    //       app_gen_id: this.data.app_gen_id,
    //       dcname: this.selectedDCMember,
    //       dconame: this.selectedDCOMember,
    //     })
    //     .then((res) => {
    //       console.log(res);
    //       this.selectedMember = null;
    //       this.selectedDCMember = null;
    //       this.selectedDCOMember = null;
    //       this.selectedIndex = 1;
    //       this.$refs.carousel.goTo(0);

    //       this.loadNextMember();
    //     });
    // },
    // goToMember(dc) {
    //   this.selectedIndex = dc.id;
    //   this.selectedMember = dc;
    //   this.$refs.carousel.goTo(dc.id - 1);
    // },
  },
  // mounted() {
  //   // keyboard shortcut binding
  //   window.addEventListener("keyup", (e) => {
  //     console.log(e);
  //     if (e.key === "Enter") {
  //       this.selectMember();
  //     }
  //     if (e.key === " ") {
  //       this.loadNextMember();
  //     }
  //     if (e.key === "ArrowRight") {
  //       this.showNext();
  //     }
  //     if (e.key === "ArrowLeft") {
  //       this.showPrev();
  //     }
  //   });

  //   this.loadNextMember();
  // },
};
</script>

<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.full-height {
  height: 99vh;
}
.card-body,
.card-footer {
  padding: 5px;
}
.card-title {
  margin-bottom: 2px;
  font-size: 16px;
}
.card-subtitle {
  margin-bottom: 2px !important;
  font-size: 14px;
}
.card-text {
  font-size: 12px;
}
.card-footer {
  padding: 2px;
  font-size: 12px;
}
.card.active {
  border: 1px solid black;
}
.selected {
  background: #d4ffc4;
}
.card:hover {
  cursor: pointer;
}

</style>
