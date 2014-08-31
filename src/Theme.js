/**	MarkDocTheme Object
  *	
  *	The Theme object which handles retrieval of theme pieces
  *	
  **/
var $ = require('./Utils.js'),
	rsvp = require('rsvp'),
	_ = require('underscore'),
	path = require('path'),
	marked = require('marked'),
	MarkedProcessor = require('./MarkedProcessor.js');

marked.setOptions({
		gfm: true,
		tables: true,
		renderer: MarkedProcessor,
		headerPrefix: 'h'
	});

function MarkDocTheme (Doc) {
	// DEFAULT VALUES
	this.__header = path.resolve(__dirname, '../themes/default/header.html');
	this.__nav = path.resolve(__dirname, '../themes/default/nav.html');
	this.__footer = path.resolve(__dirname, '../themes/default/footer.html');
	MarkedProcessor.setDoc(Doc);
	
	// Add Styles
	this.addContent(Doc);
}
MarkDocTheme.prototype.addContent = function (Doc) {
	Doc.addLESS(path.resolve(__dirname, '../themes/default/css/styles.less'));
	Doc.addLESS(path.resolve(__dirname, '../themes/default/css/print.css'));
	Doc.addJS(path.resolve(__dirname, '../themes/default/js/script.js'));
};
MarkDocTheme.prototype.renderHeader = function (opts) {
	return this.__render(this.__header, opts);
};
MarkDocTheme.prototype.renderNav = function (opts) {
	return this.__render(this.__nav, opts);
};
MarkDocTheme.prototype.renderContent = function (md, page) {
	MarkedProcessor.setPage(page);
	
	if(this.__content)
		return this.__render(this.__content, {'Content':marked(md)});
	else
		return rsvp.Promise(function (res) {
				var html = marked(md);
				res("\t\t<article id=\"page-"+page.getID()+"\">\n\t\t\t"+html+"\n\t\t</article>");
			});
};
MarkDocTheme.prototype.renderFooter = function (opts) {
	return this.__render(this.__footer, opts);
};
MarkDocTheme.prototype.__render = function (file, opts) {
	return rsvp.Promise(function (res, rej) {
			$.PromiseReader(file).then(function (tmpl) {
				try {
					res( _.template(tmpl)(opts) );
				} catch(e) {
					rej( e.stack );
				}
			}, rej);
		});
};

module.exports = MarkDocTheme;