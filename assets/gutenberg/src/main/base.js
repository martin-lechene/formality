var el = wp.element.createElement;
var formalityBlockWidth = wp.compose.createHigherOrderComponent( function( BlockListBlock ) {
    return function( props ) {
      if(props.attributes.input_halfwidth) {
        var newProps = lodash.assign({}, props, {
          className: "wp-block--halfwidth",
        });
      } else {
        var newProps = props
      }
      return el(
        BlockListBlock,
        newProps
      );
    };
}, 'formality_block-width' );

wp.hooks.addFilter( 'editor.BlockListBlock', 'formality_block-width', formalityBlockWidth );

//update metas
wp.data.subscribe(function () {
  var isSavingPost = wp.data.select('core/editor').isSavingPost();
  var isAutosavingPost = wp.data.select('core/editor').isAutosavingPost();
  if (isSavingPost && !isAutosavingPost) {
    if("formality" in wp.data.select('core/editor')) {
      let formality_keys = wp.data.select('core/editor').formality;
      let postid = wp.data.select('core/editor').getCurrentPostId();
      if(formality_keys.keys.length > 0) {
          //console.log(formality_keys.keys);
          wp.apiRequest({
      			path: `/formality/v1/options?id=${postid}`,
      			method: 'POST',
      			data: formality_keys
      		}).then(
      			( data ) => { 
        			return data;
        		},
      			( err ) => {
        			return err;
        		}
      		);
      		wp.data.select('core/editor').formality.keys = []
  		}
    }
    
  }
})


wp.domReady( function() {
  var target = document.getElementById('editor');
  var observer = new MutationObserver(function( mutations, observer ) {
    mutations.forEach(function(mutation) {
      if(mutation.target.classList.contains('components-panel')) {
        document.querySelector(".edit-post-sidebar .edit-post-sidebar__panel-tabs + .components-panel .components-panel__body:nth-child(3) .components-button").click();
        observer.disconnect();
      }        
    });    
  });
  observer.observe(target, { childList: true, subtree: true });
});

