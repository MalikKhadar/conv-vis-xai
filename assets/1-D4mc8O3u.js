const I="data:text/plain;base64,VklTVUFMSVpBVElPTl9OQU1FOiBTaW1pbGFyIGRhdGEgcG9pbnQgdGFibGUKCkVYUExBTkFUSU9OOgpUaGlzIHRhYmxlIGRpc3BsYXlzIHRoZSBtYWluIGRhdGEgcG9pbnQgYW5kIGZpdmUgc2ltaWxhciBkYXRhIHBvaW50cyB0aGF0IGhhZCB0aGUgc2FtZSBtb2RlbCBwcmVkaWN0aW9uLCBtZWFuaW5nIGVhY2ggZGF0YSBwb2ludCB3YXMgcHJlZGljdGVkIGFzIG1ha2luZyBtb3JlIHRoYW4gJDUwayBhY2NvcmRpbmcgdG8gMTk5NSBVUyBjZW5zdXMgZGF0YS4KSGVyZSdzIGEgbGF5b3V0IG9mIHRoZSB0YWJsZToKfCAgIEFnZSB8IFdvcmtjbGFzcyAgIHwgICBFZHVjYXRpb24tTnVtIHwgTWFyaXRhbCBTdGF0dXMgICAgIHwgT2NjdXBhdGlvbiAgICAgIHwgUmVsYXRpb25zaGlwICAgfCBSYWNlICAgICAgICAgICAgICAgfCBTZXggICB8ICAgQ2FwaXRhbCBHYWluIHwgICBDYXBpdGFsIExvc3MgfCAgIEhvdXJzIHBlciB3ZWVrIHwgQ291bnRyeSAgICAgICB8CnwtLS0tLS06fDotLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLTp8Oi0tLS0tLS0tLS0tLS0tLS0tLS18Oi0tLS0tLS0tLS0tLS0tLS18Oi0tLS0tLS0tLS0tLS0tLXw6LS0tLS0tLS0tLS0tLS0tLS0tLXw6LS0tLS0tfC0tLS0tLS0tLS0tLS0tLTp8LS0tLS0tLS0tLS0tLS0tOnwtLS0tLS0tLS0tLS0tLS0tLTp8Oi0tLS0tLS0tLS0tLS0tfAp8ICAgIDUxIHwgRmVkZXJhbC1nb3YgfCAgICAgICAgICAgICAgMTMgfCBNYXJyaWVkLWNpdi1zcG91c2UgfCBFeGVjLW1hbmFnZXJpYWwgfCBIdXNiYW5kICAgICAgICB8IFdoaXRlICAgICAgICAgICAgICB8IE1hbGUgIHwgICAgICAgICAgICAgIDAgfCAgICAgICAgICAgMTkwMiB8ICAgICAgICAgICAgICAgNDAgfCBVbml0ZWQtU3RhdGVzIHwKfCAgICA0MiB8IEZlZGVyYWwtZ292IHwgICAgICAgICAgICAgIDE0IHwgTWFycmllZC1jaXYtc3BvdXNlIHwgUHJvZi1zcGVjaWFsdHkgIHwgSHVzYmFuZCAgICAgICAgfCBXaGl0ZSAgICAgICAgICAgICAgfCBNYWxlICB8ICAgICAgICAgICAgICAwIHwgICAgICAgICAgIDE5MDIgfCAgICAgICAgICAgICAgIDQwIHwgVW5pdGVkLVN0YXRlcyB8CnwgICAgNTEgfCBMb2NhbC1nb3YgICB8ICAgICAgICAgICAgICAxMyB8IE1hcnJpZWQtY2l2LXNwb3VzZSB8IFByb2Ytc3BlY2lhbHR5ICB8IEh1c2JhbmQgICAgICAgIHwgV2hpdGUgICAgICAgICAgICAgIHwgTWFsZSAgfCAgICAgICAgICAgICAgMCB8ICAgICAgICAgICAxOTAyIHwgICAgICAgICAgICAgICA0MCB8IFVuaXRlZC1TdGF0ZXMgfAp8ICAgIDQyIHwgTG9jYWwtZ292ICAgfCAgICAgICAgICAgICAgMTMgfCBNYXJyaWVkLWNpdi1zcG91c2UgfCBQcm90ZWN0aXZlLXNlcnYgfCBIdXNiYW5kICAgICAgICB8IFdoaXRlICAgICAgICAgICAgICB8IE1hbGUgIHwgICAgICAgICAgICAgIDAgfCAgICAgICAgICAgMTkwMiB8ICAgICAgICAgICAgICAgNDAgfCBVbml0ZWQtU3RhdGVzIHwKfCAgICA0OSB8IExvY2FsLWdvdiAgIHwgICAgICAgICAgICAgIDE0IHwgTWFycmllZC1jaXYtc3BvdXNlIHwgUHJvZi1zcGVjaWFsdHkgIHwgSHVzYmFuZCAgICAgICAgfCBXaGl0ZSAgICAgICAgICAgICAgfCBNYWxlICB8ICAgICAgICAgICAgICAwIHwgICAgICAgICAgIDE5MDIgfCAgICAgICAgICAgICAgIDQwIHwgVW5pdGVkLVN0YXRlcyB8CnwgICAgNDIgfCBGZWRlcmFsLWdvdiB8ICAgICAgICAgICAgICAxNCB8IE1hcnJpZWQtY2l2LXNwb3VzZSB8IFByb2Ytc3BlY2lhbHR5ICB8IEh1c2JhbmQgICAgICAgIHwgQXNpYW4tUGFjLUlzbGFuZGVyIHwgTWFsZSAgfCAgICAgICAgICAgICAgMCB8ICAgICAgICAgICAxOTAyIHwgICAgICAgICAgICAgICA0MCB8IFNvdXRoICAgICAgICAgfAoKSGVyZSdzIGEgbm90ZSB0aGF0IHVzZXJzIGFyZSBwcm92aWRlZCB3aGVuIHRoZXkgdmlldyB0aGlzIHZpc3VhbGl6YXRpb246ClRoZSBtb2RlbCBtYWRlIHRoZSBzYW1lIHByZWRpY3Rpb24gb24gZWFjaCBvZiB0aGVzZSBkYXRhIHBvaW50cy4gVGhlIGZpcnN0IHJvdyBpcyB0aGUgbWFpbiBkYXRhIHBvaW50LiBDZWxscyBhcmUgZ29sZCB3aGVuIHRoZXkgc2hhcmUgdGhlIHNhbWUgdmFsdWUgYXMgdGhlIG1haW4gZGF0YSBwb2ludC4K";export{I as default};
