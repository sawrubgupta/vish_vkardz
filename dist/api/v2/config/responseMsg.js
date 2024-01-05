"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const noDataFoundMsg = "No data found";
const dataRetrivedMsg = "Data retrieved successfully";
exports.default = {
    card: {
        address: {
            // addDeliveryAddress
            addDeliveryAddresess: {
                successMsg: "Delivery address added successfully",
                failedMsg: "Failed to add address, try again"
            },
            // updateDeliveryAddress
            updateDeliveryAddresess: {
                successMsg: "Delivery address updated successfully",
                failedMsg: "Failed to update address, try again"
            },
            // getDeliveryAddress
            getDeliveryAddresses: {
                successMsg: "Address list are here",
                noDataFoundMsg: noDataFoundMsg,
                // failedMsg: "Failed to update address, try again"
            },
            // deleteAddress
            deleteDaliveryAddress: {
                successMsg: "Address deleted successfully",
                // failedMsg: "Failed to update address, try again"
            },
            // defaultAddress
            defaultAddress: {
                nullAddressId: "Address Id is required!",
                successMsg: "Default delivery address updated successfully",
                failedMsg: "Failed to update address, try again"
            },
        },
        cart: {
            // addCart
            addToCart: {
                nullUserId: "Please re-login !",
                prodctAlreadyInCart: "Product already added in cart!",
                successMsg: "Product added to cart",
                failedMsg: "Failed to add product in cart, try again !"
            },
            // getCart
            getCart: {
                nullUserId: "Please re-login !",
                successMsg: "Cart list are here!",
                noDataFoundMsg: noDataFoundMsg,
                // failedMsg: "Failed to add product in cart, try again !"
            },
            // removeFromCart
            removeFromCart: {
                nullProductId: "Product id is required!",
                successMsg: "Product remove from cart",
                // failedMsg: "Failed to add address, try again"
            },
            // addDeliveryAddress
            updateCartQty: {
                zeroQtyMsg: "Quantity cannot be 0",
                successMsg: "Quantity updated successfully",
                failedMsg: "Failed to update quantity, try again !"
            },
            // customizeCard
            addCostmizeCard: {
                successMsg: "Customization data Added Successfully",
                failedMsg: "Failed to add Customization, try again",
            },
        },
        coupons: {
            // checkCouponCode
            coupnDiscount: {
                emptyCouponCode: "Please enter a coupon code",
                invalidCouponCode: "Invalid Coupon Code !",
                successMsg: "Coupon Code Verified",
                failedMsg: "This coupon code is already used or has expired"
            },
            // redeemCoupon
            couponRedemptions: {
                emptyCouponCode: "Please enter a coupon code",
                invalidCouponCode: "This coupon code is invalid or has expired",
                successMsg: "Coupon redeem sucessfully",
                failedMsg: "Failed to reedem coupon, try again !"
            },
        },
        products: {
            // getCategory
            getCategories: {
                successMsg: "Category get successfully",
                noDataFoundMsg: noDataFoundMsg
            },
            // productList
            getProductByCategoryId: {
                nullCategoryId: "Category id is required!",
                successMsg: "Products details are here",
                noDataFoundMsg: noDataFoundMsg
                // failedMsg: "Failed to add address, try again"
            },
            // productDetail
            productDetail: {
                nullProductId: "Product id is required!",
                successMsg: "Products details are here",
                noDataFoundMsg: noDataFoundMsg
                // failedMsg: "Failed to add address, try again"
            },
            // productsFaq
            productFaq: {
                successMsg: "Data Retrieved Successfully",
                noDataFoundMsg: noDataFoundMsg
                // failedMsg: "Failed to add address, try again"
            },
        },
        purchase: {
            // purchaseCard
            cardPurchase: {
                invalidUserIdMsg: "Please re-login !",
                invalidOrderType: "Order type not define",
                successMsg: "Purchase Successfully!",
                failedMsg: "Something went wrong, please try again later or contact our support team",
            },
        },
        rating: {
            // productRating
            productRating: {
                notBuy: "Sorry! You are not allowed to review this product since you haven't bought it.",
                alreadyReviewMsg: "Already review!",
                successMsg: "Rated Successfully",
                failedMsg: "Failed!!, Please try again"
            },
            // productReviews
            reviewList: {
                nullProductIdMsg: "Product id is required!",
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
                // failedMsg: "Failed to add address, try again"
            },
            // updateReview
            updateProductReviews: {
                successMsg: "Review updated successfully",
                failedMsg: "Failed to update, Please try again!"
            },
        },
        wishlist: {
            // addToWishlist
            addToWishlist: {
                nullProductIdMsg: "Product id is required!",
                alreadyInWishlist: "Product already added in wishlist!!",
                successMsg: "Product added to wishlist",
                failedMsg: "Failed to add product in wishlist, try again"
            },
            // getWishlist
            getWishlist: {
                successMsg: "Wishlist list are here",
                noDataFoundMsg: noDataFoundMsg
                // failedMsg: "Failed to add address, try again"
            },
            // removeFromWishlist
            removeFromWishlist: {
                nullProductIdMsg: "Product id is required!",
                successMsg: "Product removed from wishlist",
            },
        },
    },
    // this msg not used in dashboard api
    dashboard: {
        contactSync: {
            // contactSync
            contactSync: {
                maxLengthMsg: "Max Length is 100",
                successMsg: "Contacts Sync Successfully",
                failedMsg: "Failed to sync contacts, try again!"
            },
        },
        deals: {
            // DealsOfTheDay
            dealOfTheDay: {
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg,
            },
        },
        home: {},
        mixingData: {},
    },
    features: {
        aboutUs: {
            // aboutUs
            addUpdateAboutUs: {
                nullUserId: "User Id is required!",
                profileNotExist: "Profile does not exist!",
                successInsertMsg: "About Us content inserted successfully!",
                successUpdateMsg: "About Us updated successfully!",
                failedMsg: "Failed, try again !"
            },
            // aboutUs
            getAboutUs: {
                nullUserId: "User Id is required!",
                noDataFoundMsg: noDataFoundMsg,
                successMsg: dataRetrivedMsg,
            },
            // deleteAboutUs
            deleteAboutUs: {
                nullUserId: "User Id is required!",
                successMsg: "About us deleted successfully",
            },
        },
        appointment: {
            // getAppointments
            appointmentList: {
                nullUserId: "User Id is required!",
                noDataFoundMsg: noDataFoundMsg,
                successMsg: dataRetrivedMsg,
            },
            // deleteAppointment
            deleteAppointment: {
                nullUserId: "User Id is required!",
                nullAppointmentId: "Appointment Id is required",
                successMsg: "Appointment deleted successfully",
                failedMsg: "Failed, try again !"
            },
            // manageAppointment
            manageAppointment: {
                nullUserId: "User Id is required!",
                successMsg: "Appointment status updated successfully",
                failedMsg: "Please try again later!!"
            },
            // bookAppointment
            bookAppointment: {
                nullUserId: "User Id is required!",
                successMsg: "Appointment Booked Successfully",
                failedMsg: "Failed!, try again"
            },
            // appointmentTimings
            appointmentTimings: {
                nullUserId: "User Id is required!",
                nullProfileId: "Profile Id is required",
                successMsg: dataRetrivedMsg,
                // failedMsg: "Failed!, try again"
            },
            // deleteTiming
            deleteAppointmentTiming: {
                nullUserId: "User Id is required!",
                invalidId: "Invalid id",
                successMsg: "Appointment time Deleted",
            },
            // addTiming
            addTiming: {
                nullUserId: "User Id is required!",
                successMsg: "Timing Added Successfully",
                failedMsg: "Failed, try again"
            },
            // updateTiming
            updateTiming: {
                nullUserId: "User Id is required!",
                successMsg: "Timing Updated Successfully",
                failedMsg: "Failed!, try again"
            },
        },
        businessHour: {
            // businessHour
            businessHourList: {
                nullUserId: "User Id is required!",
                nullProfileId: "Profile id is required",
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
            },
            // addBusinessHour
            addBusinessHour: {
                nullUserId: "User Id is required!",
                successMsg: "Business Hours Added Successfully",
                failedMsg: "Failed, try again"
            },
        },
        contacts: {
            // exchangeContact
            exchangeContacts: {
                invalidUsername: "Invalid username",
                successMsg: "Success",
                failedMsg: "Failed!, try again"
            },
            // exchangeContactList
            exchangeContactsList: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
            },
            // captureLead
            captureLead: {
                invalidUsername: "Invalid username",
                successMsg: "Success",
                failedMsg: "Failed!, try again"
            },
            // leads
            leadList: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
            },
        },
        enquiry: {
            // enquiryList
            enquiryList: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
            },
            // deleteEnquiry
            deleteEnquiry: {
                nullUserId: "User Id is required!",
                successMsg: "Enquiry Deleted Successfuly",
                failedMsg: "Failed!, try again"
            },
            // replyEnquiry
            replyEnquiry: {
                nullUserId: "User Id is required!",
                successMsg: "Email Sent Successfully",
                failedMsg: "Enquiry not found"
            },
            // enquiry
            submitEnquiry: {
                invalidUsername: "Invalid username",
                successMsg: "Success",
                failedMsg: "Failed!, try again"
            },
        },
        gallery: {
            // portfolio
            gallary: {
                nullUserId: "User Id is required!",
                limitReachedMsg: "",
                successMsg: "Portfolio Added Successfully",
                failedMsg: "Failed to add portfolio, try again"
            },
            // getPortfolio
            getPortfolio: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
            },
            // deletePortfolio
            deleteImage: {
                nullUserId: "User Id is required!",
                successMsg: "Image deleted successfully",
            },
        },
        manageFeature: {
            // getUserFeature
            getFeatureByUserId: {
                nullUserId: "User Id is required!",
                nullProfileId: "Profile id is required",
                successMsg: "User Features Get Successfully",
                // failedMsg: "Failed to add portfolio, try again"
            },
            // updateFeatures
            updateUserFeaturesStatus: {
                nullUserId: "User Id is required!",
                nullProfileId: "Profile id is required",
                successMsg: "Features updated successfully",
                failedMsg: "Failed to update user feature, try again"
            },
            // features
            features: {
                successMsg: "User Features Get Successfully",
            },
        },
        products: {
            // addProduct
            addProducts: {
                nullUserId: "User Id is required!",
                limitReachedMsg: "",
                nullProfileId: "Profile id is required",
                successMsg: "Product added successfully",
                failedMsg: "Failed to add product, try again"
            },
            // getProducts
            getProducts: {
                nullUserId: "User Id is required!",
                nullProfileId: "Profile id is required",
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
            },
            // updateProduct
            updateProduct: {
                nullUserId: "User Id is required!",
                successMsg: "Product Updated Successfully",
                failedMsg: "Failed to Update Product, try again"
            },
            // deleteProduct
            deleteProduct: {
                nullUserId: "User Id is required!",
                successMsg: "Image deleted successfully",
            },
        },
        videos: {
            // video
            addVideos: {
                nullUserId: "User Id is required!",
                // limitReachedMsg: "", // pass msg in api because limit mentioned
                successMsg: "Video added successfully",
                failedMsg: "Failed!, try again"
            },
            // videos
            getVideos: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
            },
            // deleteVideo
            deleteVideos: {
                // nullUserId: "User Id is required!",
                successMsg: "Video deleted successfully",
            },
        },
    },
    // this msg not used in dashboard api
    followers: {
        follow: {
            successMsg: dataRetrivedMsg,
            noDataFoundMsg: noDataFoundMsg
        }
    },
    // this msg not used in dashboard api
    invoice: {
        invoice: {
            successMsg: dataRetrivedMsg,
            noDataFoundMsg: noDataFoundMsg
        }
    },
    // this msg not used in notification api
    notification: {
        notification: {
            successMsg: dataRetrivedMsg,
            noDataFoundMsg: noDataFoundMsg
        }
    },
    orders: {
        order: {
            // orderList
            orderHistory: {
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
            },
            // cancelOrder
            cancelOrder: {
                successMsg: "your order was canceled.",
            },
            // orderSummary
            orderSummary: {
                invalidOrderId: "Invalid Order Id!",
                successMsg: "Order summary get successfully",
                noDataFoundMsg: noDataFoundMsg
            },
        },
        transaction: {
            // getTransactions
            transactionHistory: {
                successMsg: "Transacion list are here",
                noDataFoundMsg: "No transactions yet!"
            },
        }
    },
    profile: {
        customField: {
            // addUpdateVcf
            addCustomField: {
                nullUserId: "Please login !",
                successMsg: "Custom field added successfully",
                failedMsg: "Failed to add custom field, Please try again!"
            },
            // deleteVcf
            deleteVcf: {
                nullUserId: "User Id is required!",
                invalidVcfId: "VCF id is required!",
                successMsg: "Field deleted ducessfully",
            },
            // getVcf
            getVcf: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
                // noDataFoundMsg: noDataFoundMsg
            },
            // addCustomInfo
            addUserCustomInfo: {
                nullUserId: "User Id is required!",
                successMsg: "Success",
                failedMsg: "Failed!, try again"
            },
            // deleteUserCf
            deleteUsercf: {
                nullUserId: "User Id is required!",
                invalidId: "Id is required!",
                successMsg: "Field Deleted Sucessfully",
            },
            // getUserField
            getUserCustomField: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
            },
        },
        multiProfile: {
            // profileListing
            profileListing: {
                nullUserId: "Please login !",
                successMsg: dataRetrivedMsg,
            },
            // profileDetail
            profileDetail: {
                nullUserId: "User Id is required!",
                profileNotFound: "Profile not found",
                successMsg: dataRetrivedMsg,
            },
            // addProfile
            addProfile: {
                noPackageFound: "No packages found",
                updatePackageMsg: "Update your package",
                nullUserId: "User Id is required!",
                limitReachedMsg: "",
                successMsg: "Profile added successfully",
                failedMsg: "Failed, try again"
            },
            // updateProfile
            updateProfile: {
                nullUserId: "User Id is required!",
                successMsg: "Success",
            },
            // deleteProfile
            deleteProfile: {
                nullUserId: "User Id is required!",
                invalidProfileId: "Profile id is required!",
                cardLinkMsg: "Profile deletion is not allowed as long as a card remains linked. Kindly ensure the linked card is removed before proceeding.",
                primaryProfileValidation: "You Can't delete primary profile",
                successMsg: "Profile Deleted Successfully",
            },
            // cardList
            cardList: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
            },
        },
        primaryProfile: {
            // addPrimaryProfile
            setPrimaryProfile: {
                // nullUserId: "Please login !",
                successMsg: "Primary Profile Added Successfully",
                failedMsg: "Failed to Add Primary Profile, try again!",
                emptySlug: "", // pass msg in api because limit mentioned
            },
            // getPrimrySites   
            getPrimarySite: {
                successMsg: dataRetrivedMsg,
            },
            // primaryProfileLink
            addPrimaryLink: {
                successMsg: "Primary Profile Added Successfully",
                failedMsg: "Failed to Add Primary Profile, try again!",
            },
        },
        privateAccount: {
            // switchAccount
            switchToPublic: {
                successMsg: "Account Switch Successfully",
                failedMsg: "Failed to Switch Account, Please try again!",
            },
            // privateUserProfile
            privateProfile: {
                successMsg: "Success",
                failedMsg: "Failed!, try again",
            },
        },
        profile: {
            // getProfile
            getProfile: {
                nullUserId: "User Id is required!",
                successMsg: dataRetrivedMsg,
                noDataFoundMsg: "User not found!"
            },
            // updateProfile -> not used(old api)
            updateProfile: {
                nullUserId: "User Id is required!",
                successMsg: "Profile updated successfully !",
                failedMsg: "Failed to update the user, please try again later !",
            },
            // updateVcardinfo
            updateVcardinfo: {
                nullUserId: "User Id is required!",
                dupliValMsg: "",
                successMsg: "Profile updated successfully !",
                failedMsg: "Failed to update the user, please try again later !",
            },
            // updateImage
            updateImage: {
                nullUserId: "User Id is required!",
                invalidProileId: "Profile id is required",
                successMsg: "Image Updated Sucessfully",
                failedMsg: "Failed to update image, try again",
            },
            // userProfile
            vcardProfile: {
                notExist: "Profile not found!",
                successMsg: dataRetrivedMsg,
            },
        },
        searchUser: {
            // searchUser
            search: {
                successMsg: "Success",
                noDataFoundMsg: noDataFoundMsg,
            },
        },
        setSecurityPin: {
            // setPin
            setPin: {
                nullUserId: "User Id is required!",
                successMsg: "Profile Password Added Successfully",
                failedMsg: "Failed to add profle password",
            },
            // removePin
            removePin: {
                nullUserId: "User Id is required!",
                successMsg: "Profile Pin Remove Successfully",
                failedMsg: "Failed to remove security pin, try again later",
            },
            // validatePin
            validatePin: {
                invalidUsername: "Invalid username",
                successMsg: "Profile pin verified",
                wrongPinMsg: "Wrong profile pin !",
            },
        },
        theme: {
            // getLayots
            getLayout: {
                successMsg: dataRetrivedMsg,
            },
            // updateVcardLayout
            updateVcardLayout: {
                nullUserId: "User Id is required!",
                successMsg: "Profile Layout updated successfully",
                failedMsg: "Failed to update layout, try again",
            },
        },
    },
    services: {
        package: {}
    },
    user: {
        changePassword: {
            // changePassword
            changePassword: {
                passwordNotMatch: "old password and new password can't same",
                successMsg: "Password updated successfully !",
                failedMsg: "Something Went Wrong, Please Try again later",
                wrongPasword: "Wrong old password !!",
                userNotFound: "User not found !"
            },
        },
        checkUserName: {
            // checkUserName
            validUserName: {
                invalidUsername: "Enter Valid UserName.",
                successMsg: "Username is available!",
                failedMsg: "Username is not available !"
            },
            // checkEmail
            checkEmail: {
                invalidEmail: "Enter Valid Email.",
                successMsg: "Email Id already exist!",
                emailNotExist: "Email Id Not Registered!"
            },
        },
        countryList: {
            // getCountryList
            countryList: {
                dataRetrivedMsg: dataRetrivedMsg,
                noDataFoundMsg: noDataFoundMsg
            },
        },
        deleteAccount: {
            // deleteAccount
            deleteAccount: {
                successMsg: "Account Deleted Successfully",
                failedMsg: "Failed, try again"
            },
        },
        forgotPassword: {
            // forgotPassword
            forgotPassword: {
                invalidEmail: "Email not registered with us !",
                successMsg: "Check your mail inbox for new Password",
                failedMsg: "Something Went Wrong, Please Try again later"
            },
        },
        login: {
            // socialLogin
            socialLogin: {
                notRegistered: "User not registered with us, Please signup",
                successMsg: "Successfully logged in !",
                failedMsg: "Failed to login, try again",
                wrongPassword: "Unfortunately, Email and Password is incorrect !",
                wrongType: "Wrong type passed !",
                dupliMsg: "" // in api
            },
        },
        register: {
            // socialRegister
            socialRegister: {
                successMsg: "Congratulations, Registered successfully !",
                failedMsg: "Failed to Register, Please try again later",
                wrongType: "Wrong type passed !",
                invalidReferCode: "Invalid Refferal Code",
                accountDeleted: "Your account has been deactivated, please contact support team for more details.",
                dupliMsg: "" // in api
            },
        },
        setting: {
            // setting
            setting: {
                successMsg: "Setting updated successfully !",
                failedMsg: "Failed to update setting",
            },
        },
    }
};
