"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vcf = void 0;
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const development_1 = __importDefault(require("../../config/development"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let bucketName = process.env.BUCKET_NAME;
const credentials = development_1.default.AWS;
// ====================================================================================================
// ====================================================================================================
// export const vcf2 = async (req: Request, res: Response) => {
//   try {
//     let username: any = req.query.username;
//     const profileId = req.query.profileId;
//     if (!username || username == null) return apiResponse.errorMessage(res, 400, "Username is required");
//     const response = await axios.get(`${config.apiBaseUrl}/profile/userProfile`, {
//       headers: { "Content-type": "application/json" },
//       params: { key: username },
//     });
//     const userData = responsc.data.data;
//     // console.log(response.data.data);
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     const generateVCF = (userData: any) => {
//       const vcfData = `BEGIN:VCARD
//       VERSION:3.0
//       FN:${userData.name}
//       END:VCARD`;
//             // NOTE:${userData.notes}\n
//       // BDAY:${userData.dob}\n
//       // ${generateSocialSites(userData.socials.social_link)}
//       // ${generateContactLinks(userData.socials.contact_info)}
//       // ${generateBusinessLinks(userData.socials.business_link)}
//       // ${generatePaymentLinks(userData.socials.payments)}
//       // ${generatePhotos(userData.other_info.profile_image)}
//       const vcfPath = __dirname + '\\' + 'vcf' + userData.name.replace(/\s/g, '_') + uniqueSuffix + ".vcf";
//       console.log("vcfData", vcfData);
//       fs.writeFileSync(vcfPath, vcfData);
//       console.log(`VCF file generated successfully: ${vcfPath}`);
//     }
//     const generateEmails = (emails: any) => {
//       if (!emails || emails.length === 0) {
//         return '';
//       }
//       return emails.map((email: any) => `EMAIL:${email}`).join('\n');
//     }
//     const generateCompanies = (companies:any) => {
//       if (!companies || companies.length === 0) return '';    
//       return companies.map((company:any) => `ORG:${company}`).join('\n');
//     }
//     const generatePhoneNumbers = (numbers: any) => {
//       if (!numbers || numbers.length === 0) return '';
//       const num = numbers.map((number: any) => `TEL:${number.number}`).join('\n');
//       console.log("num", num);
//       return numbers.map((number: any) => `TEL:${number.number}`).join('\n');
//     }
//     const generateAddresses = (addresses:any) => {
//       if (!addresses || addresses.length === 0) return '';
//       return addresses.map((address:any) => `ADR;TYPE=WORK:${address}`).join('\n');
//     }
//     const generateWebsites = (websites:any) => {
//       if (!websites || websites.length === 0) return '';    
//       return websites.map((website:any) => `URL:${website}`).join('\n');
//     }
//     const generateSocialSites = (socialSites: any) => {
//       if (!socialSites || socialSites.length === 0) return '';
//       return socialSites.map((site: any) => `URL;type=${site.label}:${site.value}`).join('\n');
//     }
//     const generateContactLinks = (socialSites: any) => {
//       if (!socialSites || socialSites.length === 0) return '';
//       return socialSites.map((site: any) => `URL;type=${site.label}:${site.value}`).join('\n');
//     }
//     const generateBusinessLinks = (socialSites: any) => {
//       if (!socialSites || socialSites.length === 0) return '';
//       return socialSites.map((site: any) => `URL;type=${site.label}:${site.value}`).join('\n');
//     }
//     const generatePaymentLinks = (socialSites: any) => {
//       if (!socialSites || socialSites.length === 0) return '';
//       return socialSites.map((site: any) => `URL;type=${site.label}:${site.value}`).join('\n');
//     }
//     const generatePhotos = (image:string) => {
//       if (!image) return '';    
//       return `PHOTO;VALUE=URL:${image}\n`;
//     }
//     // Example user data with multiple phone numbers, emails, social sites with names, and multiple image URLs
//     // const userDatastatic: any = {
//     //   name: 'John Doe',
//     //   emails: ['john.doe@example.com', 'john@example.com'],
//     //   numbers: ['1234567890', '9876543210'],
//     //   socialSites: [
//     //     { name: 'LinkedIn', link: 'https://www.linkedin.com/in/johndoe' },
//     //     { name: 'Twitter', link: 'https://twitter.com/johndoe' },
//     //   ],
//     //   images: [
//     //     'https://example.com/john-doe-1.jpg',
//     //     'https://example.com/john-doe-2.png',
//     //     // Add more image URLs as needed
//     //   ],
//     //   // Add more user data properties as needed
//     // };
//     generateVCF(userData);
//     // fs.writeFileSync(vcfPath, vcfData);
//     const vcfPath = __dirname + '\\' + 'vcf' + userData.name.replace(/\s/g, '_') + uniqueSuffix + ".vcf";
//     var pdfBucket: any = new AWS.S3({
//       credentials,
//       params: {
//         Bucket: bucketName
//       }
//     })
//     pdfBucket.upload({
//       // ACL: 'public-read', 
//       Body: fs.createReadStream(vcfPath),
//       Key: 'vcf/' + 'vcf' + userData.name + uniqueSuffix + ".vcf", // file upload by below name
//       // ContentType: 'application/octet-stream' // force download if it's accessed as a top location
//     }, async (err: any, response: any) => {
//       if (err) {
//         console.log(err);
//         return apiResponse.errorMessage(res, 400, "Failed to create vcf, Please Try again");
//       }
//       if (response) {
//         fs.unlink(vcfPath, (err: any) => {
//           if (err) throw err //handle your error the way you want to;
//           console.log('file was deleted');//or else the file will be deleted
//         });
//       }
//       return apiResponse.successResponse(res, "Data Retrieved Successfully", response.Location);
//     })
//   } catch (e) {
//     console.log(e);
//     return apiResponse.somethingWentWrongMessage(res);
//   }
// }
// ====================================================================================================
// ====================================================================================================
const vcf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let username = req.query.username;
        const profileId = req.query.profileId;
        if (!username || username == null)
            return apiResponse.errorMessage(res, 400, "Username is required");
        const response = yield axios_1.default.get(`${development_1.default.apiBaseUrl}/profile/userProfile`, {
            headers: { "Content-type": "application/json" },
            params: { key: username },
        });
        const userRows = response.data.data;
        const generateVCF = (userData) => __awaiter(void 0, void 0, void 0, function* () {
            const vcfData = `BEGIN:VCARD
VERSION:3.0
${generateFullName(userData.name)}
${generateName(userData.name)}
${generateTitle(userData.designation)}
${generateCompanyName(userData.company)}
${generateDepartment(userData.department)}
${generateAddresses(userData.addresses)}
${generatePhoneNumbers(userData.phoneNumbers)}
${generateWebsites(userData.websites)}
${generateEmails(userData.emails)}
${generateNotes(userData.notes)}
${generateBirthday(userData.dob)}
URL;type=vkardz:https://vkardz.com/${username}
${generateSocialLinks(userData.socialLinks)}
${generateContactLinks(userData.contactLinks)}
${yield generatePhotos(userData.image)}
END:VCARD`;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const vcfFileName = __dirname + `user_${uniqueSuffix}${userData.name.replace(/\s/g, '_')}.vcf`;
            fs_1.default.writeFileSync(vcfFileName, vcfData);
            console.log(`VCF file generated successfully: ${vcfFileName}`);
            var pdfBucket = new aws_sdk_1.default.S3({
                credentials,
                params: {
                    Bucket: bucketName
                }
            });
            pdfBucket.upload({
                // ACL: 'public-read', 
                Body: fs_1.default.createReadStream(vcfFileName),
                Key: 'vcf/' + 'vcf' + userData.name + uniqueSuffix + ".vcf", // file upload by below name
                // ContentType: 'application/octet-stream' // force download if it's accessed as a top location
            }, (err, response) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                    return apiResponse.errorMessage(res, 400, "Failed to create vcf, Please Try again");
                }
                if (response) {
                    fs_1.default.unlink(vcfFileName, (err) => {
                        if (err)
                            throw err; //handle your error the way you want to;
                        console.log('file was deleted'); //or else the file will be deleted
                    });
                }
                return apiResponse.successResponse(res, "Data Retrieved Successfully", response.Location);
            }));
        });
        const generateTitle = (title) => {
            if (userData.featureStatus.vcf.designation === 0)
                return '';
            if (!title)
                return '';
            return `TITLE:${title}\n`;
        };
        const generateName = (name) => {
            if (userData.featureStatus.vcf.name === 0)
                return '';
            if (!name)
                return '';
            return `FN:${name}\n`;
        };
        // const generateLastName = (name:any) => {
        //   if (userData.featureStatus.vcf.name === 0) return '';
        //   if (!name) return '';
        //   return `LN:${"abctest"}\n`;
        // }
        const generateFullName = (name) => {
            if (userData.featureStatus.vcf.name === 0)
                return '';
            if (!name)
                return '';
            // return `N:${name}\n`;
            return `N;CHARSET=UTF-8:;${name}\n`;
        };
        // N;CHARSET=UTF-8:;Ravi Tak;;;
        const generateCompanyName = (company) => {
            if (userData.featureStatus.vcf["company-name"] === 0)
                return '';
            if (!company || company.length === 0)
                return '';
            return company.map((company) => `ORG:${company}`).join('\n');
        };
        const generateDepartment = (department) => {
            if (userData.featureStatus.vcf.department === 0)
                return '';
            if (!department)
                return '';
            return `ORG:${department}\n`;
        };
        const generateAddresses = (addresses) => {
            if (userData.featureStatus.vcf.address === 0)
                return '';
            if (!addresses || addresses.length === 0)
                return '';
            return addresses.map((address) => `ADR;TYPE=WORK:${address}`).join('\n');
        };
        const generatePhoneNumbers = (phoneNumbers) => {
            if (userData.featureStatus.vcf.number === 0)
                return '';
            if (!phoneNumbers || phoneNumbers.length === 0)
                return '';
            return phoneNumbers.map((number) => `TEL:${number.number}`).join('\n');
        };
        const generateWebsites = (websites) => {
            if (userData.featureStatus.vcf.website === 0)
                return '';
            if (!websites || websites.length === 0)
                return '';
            // return websites.map((website:any) => `URL:${website}`).join('\n');
            return websites
                .filter((link) => utility.urlValidation(link))
                .map((link) => `URL:${link}`)
                .join('\r\n');
        };
        const generateEmails = (emails) => {
            if (userData.featureStatus.vcf.email === 0)
                return '';
            if (!emails || emails.length === 0)
                return '';
            return emails.map((email) => `EMAIL:${email}`).join('\n');
        };
        const generateNotes = (notes) => {
            if (userData.featureStatus.vcf.notes === 0)
                return '';
            if (!notes)
                return '';
            return `NOTE:${notes}\n`;
        };
        const generateBirthday = (dob) => {
            if (userData.featureStatus.vcf.dob === 0)
                return '';
            if (!dob)
                return '';
            return `BDAY:${dob}\n`;
        };
        // const isValidUrl = (url:any) => {
        //   // Simple URL validation using a regular expression
        //   const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        //   return urlPattern.test(url);
        // }
        const generateSocialLinks = (socialLinks) => {
            // if (userData.featureStatus.vcf.dob === 0) return '';
            if (!socialLinks || socialLinks.length === 0)
                return '';
            var urlRegEx = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/.*)?$/i;
            ;
            // return socialLinks.map((link:any) => `URL;type=${link.label}:${link.value}`).join('\n');
            return socialLinks
                .filter((link) => utility.urlValidation(link.value))
                .map((link) => `URL;type=${link.name}:${link.value}`)
                .join('\r\n');
        };
        const generateContactLinks = (contactLinks) => {
            // if (userData.featureStatus.vcf.dob === 0) return '';
            if (!contactLinks || contactLinks.length === 0)
                return '';
            // return socialLinks.map((link:any) => `URL;type=${link.label}:${link.value}`).join('\n');
            return contactLinks
                .filter((link) => utility.urlValidation(link.value))
                .map((link) => {
                let url = link.value;
                if (link.name.toLowerCase() === 'whatsapp') {
                    url = `https://api.whatsapp.com/${url}`;
                    return `URL;type=${link.name}:${url}`;
                }
                else {
                    return '';
                }
            })
                .join('\r\n');
        };
        const generatePhotos = (image) => __awaiter(void 0, void 0, void 0, function* () {
            if (!image)
                return '';
            const imgUrl = development_1.default.imgUrl + image;
            const response1 = yield axios_1.default.get(imgUrl, { responseType: 'arraybuffer' });
            const imageData = Buffer.from(response1.data);
            // Convert to base64
            const base64Image = imageData.toString('base64');
            // console.log("base64Image", base64Image);
            // PHOTO;ENCODING=b;TYPE=image/jpeg:UklGRuIpAABXRUJQVlA4WAoAAAAsAAAA/AEA
            return `PHOTO;ENCODING=b;TYPE=image/jpeg:${base64Image}\n`;
        });
        // Example user data with multiple phone numbers, emails, social links with names, and a single image URL
        const userData = {
            name: userRows.name,
            designation: userRows.designation,
            department: userRows.department,
            company: userRows.company_name,
            addresses: userRows.address,
            phoneNumbers: userRows.number,
            websites: userRows.website,
            emails: userRows.email,
            notes: userRows.notes,
            dob: userRows.dob,
            socialLinks: userRows.socials.social_link,
            contactLinks: userRows.socials.contact_info,
            // socialLinks: [
            //   { name: 'LinkedIn', link: 'https://www.linkedin.com/in/johndoe' },
            //   { name: 'Twitter', link: 'https://twitter.com/johndoe' },
            //   // Add more social links as needed
            // ],
            image: userRows.other_info.profile_image,
            featureStatus: userRows.profile_setting.profile_features,
            // Add more user data properties as needed
        };
        generateVCF(userData);
    }
    catch (e) {
        console.log(e);
        return apiResponse.somethingWentWrongMessage(res);
    }
});
exports.vcf = vcf;
// ====================================================================================================
// ====================================================================================================
