import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  update,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js";

// Cau hinh firebase
const firebaseConfig = {
  apiKey: "AIzaSyATQxv0mEDu5JnwsGRnM2eKJgNBD4phcgc",
  authDomain: "thue-xe-a17d2.firebaseapp.com",
  databaseURL: "https://thue-xe-a17d2-default-rtdb.firebaseio.com",
  projectId: "thue-xe-a17d2",
  storageBucket: "thue-xe-a17d2.appspot.com",
  messagingSenderId: "744561795993",
  appId: "1:744561795993:web:349446365fa3f907cfa908",
  measurementId: "G-F5GN2D06JW",
};

// Khai bao bien
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getDatabase();
var accountStack = [];

const ref_Account = ref(db, "Account");
onValue(ref_Account, (snapshot) => {
  var dataJson = snapshot.val();
  accountStack = [];
  // Duyệt chuỗi JSON
  for (const accountId in dataJson) {
    if (dataJson.hasOwnProperty(accountId)) {
      const account = dataJson[accountId];

      // Tạo đối tượng tài khoản
      var newAccount = {
        id: accountId,
        name: account.name,
        status: account.status,
        time: account.time,
        leftTime: account.leftTime,
      };

      if (newAccount.status == "Chưa thuê") {
        newAccount.leftTime = "30";
        newAccount.time = "";
      }
      // Thêm tài khoản vào ngăn xếp
      accountStack.push(newAccount);
    }
  }

  console.log(accountStack);
  updateAccountTable();
});

const ref_Position_1 = ref(db, "position/position_1");
onValue(ref_Position_1, (snapshot) => {
  if (snapshot.val()) {
    document.getElementById("position_1").style.backgroundColor = "#4CAF50";
    document.getElementById("position_1").style.color = "#fff";
  } else {
    document.getElementById("position_1").style.backgroundColor = "#ccc";
    document.getElementById("position_1").style.color = "#333";
  }
});

const ref_Position_2 = ref(db, "position/position_2");
onValue(ref_Position_2, (snapshot) => {
  if (snapshot.val()) {
    document.getElementById("position_2").style.backgroundColor = "#4CAF50";
    document.getElementById("position_2").style.color = "#fff";
  } else {
    document.getElementById("position_2").style.backgroundColor = "#ccc";
    document.getElementById("position_2").style.color = "#333";
  }
});

const ref_Position_3 = ref(db, "position/position_3");
onValue(ref_Position_3, (snapshot) => {
  if (snapshot.val()) {
    document.getElementById("position_3").style.backgroundColor = "#4CAF50";
    document.getElementById("position_3").style.color = "#fff";
  } else {
    document.getElementById("position_3").style.backgroundColor = "#ccc";
    document.getElementById("position_3").style.color = "#333";
  }
});

const ref_checkID = ref(db, "Current/id");
onValue(ref_checkID, (snapshot) => {
  var id = snapshot.val();
  console.log(id);
  if (id != null) {
    for (var i = 0; i < accountStack.length; i++) {
      var account = accountStack[i];
      if (id == account.id) {
        update(ref(db, "Current"), { id: "" });
        update(ref(db, "Current"), { checkID: 1 });
      }
    }
  }
});

// Hàm xử lý khi nhấn nút "Submit"
function handleSubmit(event) {
  event.preventDefault(); // Ngăn chặn việc gửi lại form

  // Lấy dữ liệu từ các trường input trong form
  var accountId = document.getElementById("account-id").value;
  var accountName = document.getElementById("account-name").value;

  // Cập nhật lên firebase
  var path = "Account/" + accountId;

  update(ref(db, path), { id: accountId });
  update(ref(db, path), { name: accountName });
  update(ref(db, path), { status: "Chưa thuê" });
  update(ref(db, path), { time: "" });
  update(ref(db, path), { leftTime: "30" });

  // Sau khi xử lý, có thể làm mới form
  document.getElementById("add-account-form").reset();
}

// Hàm cập nhật bảng danh sách tài khoản
function updateAccountTable() {
  var accountTable = document.getElementById("account-table");
  // Xóa tất cả các hàng trừ tiêu đề
  while (accountTable.rows.length > 1) {
    accountTable.deleteRow(1);
  }

  // Thêm tài khoản từ ngăn xếp vào bảng
  for (var i = 0; i < accountStack.length; i++) {
    var account = accountStack[i];

    var row = accountTable.insertRow();
    row.innerHTML =
      "<td>" +
      account.id +
      "</td>" +
      "<td>" +
      account.name +
      "</td>" +
      "<td>" +
      account.status +
      "</td>" +
      "<td>" +
      account.time +
      "</td>" +
      "<td>" +
      account.leftTime +
      " ngày" +
      "</td>" +
      "<td><button onclick=\"deleteAccount('" +
      account.id +
      "')\">Xóa</button></td>";
  }
}

// Đăng ký sự kiện "submit" cho form
document
  .getElementById("add-account-form")
  .addEventListener("submit", handleSubmit);

// Xóa tài khoản
setInterval(function () {
  if (temp) {
    set(ref(db, path), { id: null });
    console.log(path);
    temp = 0;
  }
}, 200);
