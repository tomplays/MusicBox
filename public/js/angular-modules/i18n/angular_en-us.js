'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
n = n + '';
var i = n.indexOf('.');
return (i == -1) ? 0 : n.length - i - 1;
}
function getVF(n, opt_precision) {
var v = opt_precision;
if (undefined === v) {
v = Math.min(getDecimals(n), 3);
}
var base = Math.pow(10, v);
var f = ((n * base) | 0) % base;
return {v: v, f: f};
}
$provide.value("$locale", {
"CUSTOM" : {
	"COMMENT" : {
		"single" : "comment",
		"textarea" : "Your comment",
		"label" : "Add a comment",
		"verb" : "comment",
		"needs_logging": "Please login first",
		"logged_in_as" : "Logged in as",
		"edit": "Edit comment",
		"select_action": "Select le comment"



	},
	"DOCUMENT" : {
		"by_author" : "by",
		"my_documents" : "My documents",
		"default_title" :"Your Title",
		"default_content" :"Your text-content",
	 	"document_options":"Document options",
		"instructions" :"Pick a title",
		"default_published." :"pick publish status",
		"create_new" :"Create new document",
		"create_first":"Create your first document"


	},
	"DOCUMENT_FIELDS" : {
		"title" : "title",
		"published" : "published",
		"room" : "room",
		"updated" : "updated"

	},
	"ACTIONS" : {
		"save" : "save",
		"edit" :"edit",
		"delete" :"delete",
		"select" : "select",
		"select_edit" : "select / edit",
		"back_to_document" :"back to reading mode",
		"more_options" : "more options",
		"add" : "Add",
		"add_one" : "Add a "

	},
	"HELP" : {
		"fresh_document" : "Your document is ready ! A guide is available in the 'help' menu  !",
		

	},
	"OBJECTS" : {
			"comment": "Comment",
			"note" :"Note",
			"semantic":"Semantic",
			"generic":"Generic",
			"container":"Container",
			"container_class":"Container class",
			"child":"Child object",
			"media":"Media",
			"markup":"'Classic' markup",
			"hyperlink":"Link",
			"datavalue":"raw data"


	},
	"POSITIONS" : {
		"wide" : "full width",
		"left" : "on the left",
		"right" : "on the right",
		"center" : "centered",
		"inline" : "inline",
		"under" : "under",
		"global" : "global",
		"background" : "as background",
		"slidewide" :"slidewide"

	},








	"APP" : {
		"write_invitation" : "Vous avez quelquechose à nous raconter ?",
		"write_invitation_link" : "En savoir plus &raquo;"



	},
	"USER": {
		"login" : "Login",
		"loginOrSignup" : "Login/ Signup",
		"login_condition" : "if you have an account",
		"register": "Create account",
		"no_account_yet" : "No account yet ?",
		"pick_password" : "Password",
		"pick_username" : "Username (public)",
		"pick_email" : "Your email",
		"logout" : "Logout",
		"myprofile": "My profile",
		"hidden_from_public": "(not visible) ",
		"logged_in_as" : "Vous êtes connecté en tant que",
		"subscribe_title" :"Subscribe hacktuel newsletter",
		"subscribe_action" :"fill with your email",
		"subscribe_fields" :"",
		"subscribe_option" :"Subscribe hacktuel newsletter",
		"subscribe_success" :"A mail containing a confim link has been sent to you"
	},

} ,
"DATETIME_FORMATS": {
"AMPMS": [
"AM",
"PM"
],
"DAY": [
"Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday"
],
"MONTH": [
"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"
],
"SHORTDAY": [
"Sun",
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat"
],
"SHORTMONTH": [
"Jan",
"Feb",
"Mar",
"Apr",
"May",
"Jun",
"Jul",
"Aug",
"Sep",
"Oct",
"Nov",
"Dec"
],
"fullDate": "EEEE, MMMM d, y",
"longDate": "MMMM d, y",
"medium": "MMM d, y h:mm:ss a",
"mediumDate": "MMM d, y",
"mediumTime": "h:mm:ss a",
"short": "M/d/yy h:mm a",
"shortDate": "M/d/yy",
"shortTime": "h:mm a"
},
"NUMBER_FORMATS": {
"CURRENCY_SYM": "$",
"DECIMAL_SEP": ".",
"GROUP_SEP": ",",
"PATTERNS": [
{
"gSize": 3,
"lgSize": 3,
"maxFrac": 3,
"minFrac": 0,
"minInt": 1,
"negPre": "-",
"negSuf": "",
"posPre": "",
"posSuf": ""
},
{
"gSize": 3,
"lgSize": 3,
"maxFrac": 2,
"minFrac": 2,
"minInt": 1,
"negPre": "\u00a4-",
"negSuf": "",
"posPre": "\u00a4",
"posSuf": ""
}
]
},
"id": "en-us",
"pluralCat": function (n, opt_precision) { var i = n | 0; var vf = getVF(n, opt_precision); if (i == 1 && vf.v == 0) { return PLURAL_CATEGORY.ONE; } return PLURAL_CATEGORY.OTHER;}
});
}]);

 
