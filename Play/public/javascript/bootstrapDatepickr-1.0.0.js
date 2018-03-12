!function(t,e,r,a){"use strict";function n(e,r){this.element=e,this.options=t.extend({},o,r),this._defaults=o,this._name=i,this.settings={date_object:new Date,selected_day:"",current_month:(new Date).getMonth()+1,current_year:(new Date).getFullYear(),selected_date:"",allowed_formats:["d","do","D","j","l","w","F","m","M","n","U","y","Y"],month_name:["January","February","March","April","May","June","July","August","September","October","November","December"],date_formatting:{weekdays:{shorthand:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],longhand:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},months:{shorthand:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],longhand:["January","February","March","April","May","June","July","August","September","October","November","December"]}}},this.init()}var i="bootstrapDatepickr",o={date_format:"d/m/Y"};t.extend(n.prototype,{init:function(){var e=this,r=e.element;t(r).parent().hasClass("input-group")&&t(r).prev().addClass("addonclick_id-"+t(r).attr("id")),this.bindEvents(),this.init_cal(e,r,e.settings.current_month,e.settings.current_year)},bindEvents:function(){var e=this,r=e.element;t(r).on("click",e,this.wrapper_clicked),t(".addonclick_id-"+t(r).attr("id")).on("click",e,this.addon_clicked)},init_cal:function(e,r,a,n){var i=e.settings,o='<div class="bootstrapDatepickr-cal cal_id-'+t(r).attr("id")+' bootstrapDatepickr-hidden">';o+='<table id="bootstrapDatepickr-table" class="table table-bordered table_id-'+t(r).attr("id")+'" cols="7">',o+='<tr class="bootstrapDatepickr-header">',o+='<th class="bootstrapDatepickr-prev-month prev_id-'+t(r).attr("id")+'" colspan="1">&laquo;</th>',o+='<th colspan="5" class="bootstrapDatepickr-month month_id-'+t(r).attr("id")+'">'+i.month_name[a-1]+"  "+n+"</th>",o+='<th class="bootstrapDatepickr-next-month next_id-'+t(r).attr("id")+'" colspan="1">&raquo;</th></tr>',o+='<tbody id="bootstrapDatepickr-body-'+t(r).attr("id")+'">',o+="</tbody></table></div>",t(r).after(o),this.generate_calendar(e,i.current_month,i.current_year)},addon_clicked:function(e){var r=e.data;t(".cal_id-"+t(r.element).attr("id")).toggleClass("bootstrapDatepickr-hidden")},wrapper_clicked:function(e){function r(){var e=new Date(i.settings.current_year,i.settings.current_month-1,i.settings.selected_day);i.settings.date_object=e;var r=i.options.date_format,o=new Date(e.getTime()),d={d:function(){var t=d.j();return 10>t?"0"+t:t},"do":function(){var t=d.j();return a(t)},D:function(){return i.settings.date_formatting.weekdays.shorthand[d.w()]},j:function(){return o.getDate()},l:function(){return i.settings.date_formatting.weekdays.longhand[d.w()]},w:function(){return o.getDay()},F:function(){return n(d.n()-1,!1)},m:function(){var t=d.n();return 10>t?"0"+t:t},M:function(){return n(d.n()-1,!0)},n:function(){return o.getMonth()+1},U:function(){return o.getTime()/1e3},y:function(){return String(d.Y()).substring(2)},Y:function(){return o.getFullYear()}},s="",c="";return r.indexOf("/")>-1?(s=r.split("/"),c="/"):r.indexOf("-")>-1?(s=r.split("-"),c="-"):(s=r.split(" "),c=" "),t.each(s,function(t,e){e=e.replace(/[\W_]+/g,"").trim(),i.settings.allowed_formats.indexOf(e)>-1&&(r=r.replace(e,d[e]))}),r}function a(t){var e=["th","st","nd","rd"],r=t%100;return t+(e[(r-20)%10]||e[r]||e[0])}function n(t,e){return e===!0?i.settings.date_formatting.months.shorthand[t]:i.settings.date_formatting.months.longhand[t]}var i=e.data,o=i.settings;t("body").unbind().on("click",".day_id-"+t(this).attr("id"),function(){if("&nbsp;"!=t(this).html()){o.selected_day=t(this).html();var e=r();o.selected_date=e,t("#"+t(i.element).attr("id")).val(e),t(".cal_id-"+t(i.element).attr("id")).addClass("bootstrapDatepickr-hidden")}}),t("body").on("click",".next_id-"+t(this).attr("id"),function(){12===o.current_month?(o.current_year++,o.current_month=1):o.current_month++,i.generate_calendar(i,o.current_month,o.current_year),t(".month_id-"+t(i.element).attr("id")).html(o.month_name[o.current_month-1]+" - "+o.current_year)}),t("body").on("click",".prev_id-"+t(this).attr("id"),function(){1==o.current_month?(o.current_year=Number(o.current_year)-1,o.current_month=12):o.current_month=Number(o.current_month)-1,i.generate_calendar(i,o.current_month,o.current_year),t(".month_id-"+t(i.element).attr("id")).html(o.month_name[o.current_month-1]+" - "+o.current_year)}),t(".cal_id-"+t(this).attr("id")).toggleClass("bootstrapDatepickr-hidden"),i.highlight_selected_day(i)},highlight_selected_day:function(e){""!=t(e.element).val()&&""!=e.settings.selected_date&&e.settings.current_year==e.settings.date_object.getFullYear()&&e.settings.current_month==e.settings.date_object.getMonth()+1&&t(".day_id-"+t(e.element).attr("id")).each(function(r){e.settings.selected_day==t(this).text()?t(this).addClass("bootstrapDatepickr-selected_date"):t(this).removeClass("bootstrapDatepickr-selected_date")})},generate_calendar:function(e,r,a){var n=e.element,i=[31,0,31,30,31,30,31,31,30,31,30,31],o=new Date,d=new Date(a,r-1,1);d.od=d.getDay()+1;var s=a==o.getFullYear()&&r==o.getMonth()+1?o.getDate():0;i[1]=d.getFullYear()%100!=0&&d.getFullYear()%4==0||d.getFullYear()%400==0?29:28,t(".row_id-"+t(n).attr("id")).remove();for(var c='<tr class="bootstrapDatepickr-row row_id-'+t(n).attr("id")+'">',l=0;7>l;l++)c+='<td class="bootstrapDatepickr-days">'+"SMTWTFS".substr(l,1)+"</td>";c+='</tr><tr class="bootstrapDatepickr-row row_id-'+t(n).attr("id")+'">';for(var u=1;42>=u;u++){var h="",_=u-d.od>=0&&u-d.od<i[r-1]?u-d.od+1:"&nbsp;";_==s&&(h="bootstrapDatepickr-today"),c+='<td class="bootstrapDatepickr-day day_id-'+t(n).attr("id")+" "+h+'">'+_+"</td>",u%7==0&&36>u&&(c+='</tr><tr class="bootstrapDatepickr-row row_id-'+t(n).attr("id")+'">')}c+="</tr></table></div>",t("#bootstrapDatepickr-body-"+t(n).attr("id")).append(c),t(".row_id-"+t(n).attr("id")).each(function(){""===t(this).text().trim()&&t(this).remove()}),t(n).parent().hasClass("input-group")?(t(".cal_id-"+t(n).attr("id")).detach().insertAfter(t(n).parent()),t(".cal_id-"+t(n).attr("id")).css("left",t(n).parent().position().left),t(".cal_id-"+t(n).attr("id")).css("width",t(n).parent().outerWidth())):(t(".cal_id-"+t(n).attr("id")).css("left",t(n).position().left),t(".cal_id-"+t(n).attr("id")).css("width",t(n).outerWidth())),t(".cal_id-"+t(n).attr("id")).css("top",t(n).position().top+t(n).outerHeight()),this.highlight_selected_day(e)}}),t.fn[i]=function(e){return this.each(function(){t.data(this,"plugin_"+i)||t.data(this,"plugin_"+i,new n(this,e))})}}(jQuery,window,document);