const g="data:text/plain;base64,VklTVUFMSVpBVElPTl9OQU1FOiBTaW1pbGFyIGRhdGEgcG9pbnQgdGFibGUKCkVYUExBTkFUSU9OOgpUaGlzIHRhYmxlIGRpc3BsYXlzIHRoZSBtYWluIGRhdGEgcG9pbnQgYW5kIGZpdmUgc2ltaWxhciBkYXRhIHBvaW50cyB0aGF0IGhhZCB0aGUgc2FtZSBtb2RlbCBwcmVkaWN0aW9uLCBtZWFuaW5nIGVhY2ggZGF0YSBwb2ludCB3YXMgcHJlZGljdGVkIGFzIG1ha2luZyBsZXNzIHRoYW4gJDUwayBhY2NvcmRpbmcgdG8gMTk5NSBVUyBjZW5zdXMgZGF0YS4KSGVyZSdzIGEgbGF5b3V0IG9mIHRoZSB0YWJsZToKfCAgIEFnZSB8IFdvcmtjbGFzcyAgIHwgICBFZHVjYXRpb24tTnVtIHwgTWFyaXRhbCBTdGF0dXMgICB8IE9jY3VwYXRpb24gICAgICB8IFJlbGF0aW9uc2hpcCAgIHwgUmFjZSAgIHwgU2V4ICAgIHwgICBDYXBpdGFsIEdhaW4gfCAgIENhcGl0YWwgTG9zcyB8ICAgSG91cnMgcGVyIHdlZWsgfCBDb3VudHJ5ICAgICAgIHwKfC0tLS0tLTp8Oi0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS0tOnw6LS0tLS0tLS0tLS0tLS0tLS18Oi0tLS0tLS0tLS0tLS0tLS18Oi0tLS0tLS0tLS0tLS0tLXw6LS0tLS0tLXw6LS0tLS0tLXwtLS0tLS0tLS0tLS0tLS06fC0tLS0tLS0tLS0tLS0tLTp8LS0tLS0tLS0tLS0tLS0tLS06fDotLS0tLS0tLS0tLS0tLXwKfCAgICA0MiB8IFByaXZhdGUgICAgIHwgICAgICAgICAgICAgIDEwIHwgV2lkb3dlZCAgICAgICAgICB8IEV4ZWMtbWFuYWdlcmlhbCB8IE5vdC1pbi1mYW1pbHkgIHwgV2hpdGUgIHwgRmVtYWxlIHwgICAgICAgICAgICAgIDAgfCAgICAgICAgICAgICAgMCB8ICAgICAgICAgICAgICAgNTUgfCBVbml0ZWQtU3RhdGVzIHwKfCAgICA0NSB8IFByaXZhdGUgICAgIHwgICAgICAgICAgICAgIDEwIHwgV2lkb3dlZCAgICAgICAgICB8IEV4ZWMtbWFuYWdlcmlhbCB8IFVubWFycmllZCAgICAgIHwgV2hpdGUgIHwgRmVtYWxlIHwgICAgICAgICAgICAgIDAgfCAgICAgICAgICAgICAgMCB8ICAgICAgICAgICAgICAgNTUgfCBVbml0ZWQtU3RhdGVzIHwKfCAgICAzOCB8IFByaXZhdGUgICAgIHwgICAgICAgICAgICAgIDEwIHwgV2lkb3dlZCAgICAgICAgICB8IEV4ZWMtbWFuYWdlcmlhbCB8IE5vdC1pbi1mYW1pbHkgIHwgV2hpdGUgIHwgRmVtYWxlIHwgICAgICAgICAgICAgIDAgfCAgICAgICAgICAgICAgMCB8ICAgICAgICAgICAgICAgNDAgfCBVbml0ZWQtU3RhdGVzIHwKfCAgICAzNiB8IExvY2FsLWdvdiAgIHwgICAgICAgICAgICAgIDExIHwgTmV2ZXItbWFycmllZCAgICB8IFByb3RlY3RpdmUtc2VydiB8IE5vdC1pbi1mYW1pbHkgIHwgQmxhY2sgIHwgRmVtYWxlIHwgICAgICAgICAgICAgIDAgfCAgICAgICAgICAgICAgMCB8ICAgICAgICAgICAgICAgNjAgfCBVbml0ZWQtU3RhdGVzIHwKfCAgICA1MyB8IFByaXZhdGUgICAgIHwgICAgICAgICAgICAgIDEwIHwgV2lkb3dlZCAgICAgICAgICB8IEV4ZWMtbWFuYWdlcmlhbCB8IE5vdC1pbi1mYW1pbHkgIHwgV2hpdGUgIHwgRmVtYWxlIHwgICAgICAgICAgICAgIDAgfCAgICAgICAgICAgICAgMCB8ICAgICAgICAgICAgICAgNTQgfCBVbml0ZWQtU3RhdGVzIHwKfCAgICA0MSB8IFByaXZhdGUgICAgIHwgICAgICAgICAgICAgIDExIHwgTmV2ZXItbWFycmllZCAgICB8IFByb2Ytc3BlY2lhbHR5ICB8IE5vdC1pbi1mYW1pbHkgIHwgV2hpdGUgIHwgRmVtYWxlIHwgICAgICAgICAgICAgIDAgfCAgICAgICAgICAgICAgMCB8ICAgICAgICAgICAgICAgNjAgfCBVbml0ZWQtU3RhdGVzIHwKCkhlcmUncyBhIG5vdGUgdGhhdCB1c2VycyBhcmUgcHJvdmlkZWQgd2hlbiB0aGV5IHZpZXcgdGhpcyB2aXN1YWxpemF0aW9uOgpUaGUgbW9kZWwgbWFkZSB0aGUgc2FtZSBwcmVkaWN0aW9uIG9uIGVhY2ggb2YgdGhlc2UgZGF0YSBwb2ludHMuIFRoZSBmaXJzdCByb3cgaXMgdGhlIG1haW4gZGF0YSBwb2ludC4gQ2VsbHMgYXJlIGdvbGQgd2hlbiB0aGV5IHNoYXJlIHRoZSBzYW1lIHZhbHVlIGFzIHRoZSBtYWluIGRhdGEgcG9pbnQuCg==";export{g as default};