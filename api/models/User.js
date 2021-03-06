const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const UserSchema = new mongoose.Schema(
  {
    //이름
    name: {
      type: String,
      required: [true, "이름을 작성해 주세요."],
      maxlength: [50, "이름의 최대 길이는 50자리 입니다."],
    },

    //이메일
    email: {
      type: String,
      required: [true, "이메일을 작성해 주세요."],
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => "이메일 주소가 유효하지 않습니다",
      },
    },

    //패스워드
    password: {
      type: String,
      required: [true, "비밀번호를 작성해 주세요."],
      validate: {
        validator: function (v) {
          return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/.test(
            v
          );
        },
        message: (props) =>
          "8~16자 영문 대 소문자 / 숫자 / 특수문자를 사용하세요",
      },
    },

    //소개
    desc: {
      type: String,
    },

    //판매자 여부
    isSeller: {
      type: Boolean,
      default: false,
    },

    //관리자 여부
    isAdmin: {
      type: Boolean,
      default: false,
    },

    //팔로워
    followers: {
      type: Array,
      default: [],
    },

    //팔로잉
    followings: {
      type: Array,
      default: [],
    },

    //포인트
    point: {
      type: Number,
      default: 0,
    },

    //유저 사진
    img: {
      type: String,
    },

    //내가 판매하고 있는 상품
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

//모델단에서 비밀번호 로직처리
UserSchema.pre("save", function (next) {
  this.password = CryptoJS.AES.encrypt(
    this.password,
    process.env.PASSWORD_SECRET_KEY
  ).toString();
  next();
});

UserSchema.methods.isPasswordMatch = function (currentPassword) {
  const hashedPassword = CryptoJS.AES.decrypt(
    this.password,
    process.env.PASSWORD_SECRET_KEY
  );

  //공개키보단 해시가 더안전할듯?
  return hashedPassword.toString(CryptoJS.enc.Utf8) === currentPassword;
};

module.exports = mongoose.model("User", UserSchema);
