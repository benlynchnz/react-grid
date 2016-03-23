export default (col, row) => {

    switch (row.data.stars) {
      case 5:
        return `<i class="material-icons" style="color: rgb(241, 196, 24); font-size:35px;line-height:45px;">&#xE838;&#xE838;&#xE838;&#xE838;&#xE838;</i>`;
      case 4:
        return `<i class="material-icons" style="color: rgb(241, 196, 24); font-size:35px;line-height:45px;">&#xE838;&#xE838;&#xE838;&#xE838;&#xE83A;</i>`;
      case 3:
        return `<i class="material-icons" style="color: rgb(241, 196, 24); font-size:35px;line-height:45px;">&#xE838;&#xE838;&#xE838;&#xE83A;&#xE83A;</i>`;
      case 2:
        return `<i class="material-icons" style="color: rgb(241, 196, 24); font-size:35px;line-height:45px;">&#xE838;&#xE838;&#xE83A;&#xE83A;&#xE83A;</i>`;
      case 1:
        return `<i class="material-icons" style="color: rgb(241, 196, 24); font-size:35px;line-height:45px;">&#xE838;&#xE83A;&#xE83A;&#xE83A;&#xE83A;</i>`;
      case 0:
        return `<i class="material-icons" style="color: rgb(241, 196, 24); font-size:35px;line-height:45px;">&#xE83A;&#xE83A;&#xE83A;&#xE83A;&#xE83A;</i>`;
    }
};
