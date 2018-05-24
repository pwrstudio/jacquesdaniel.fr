<?php

// -------
// -------
// -------
// CORS
if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    list($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']) = explode(':', base64_decode(substr($_SERVER['REDIRECT_HTTP_AUTHORIZATION'], 6)));
}

// add_filter('query_vars', function ($vars) {
//     $vars[] = 'post_parent';
//     return $vars;
// });

// -------
// -------
// -------
// CUSTOM IMAGE SIZES
add_action('after_setup_theme', 'image_size_setup');
function image_size_setup()
{
    add_image_size('pwr-small', 500);
    add_image_size('pwr-medium', 800);
    add_image_size('pwr-large', 1400);
    // add_image_size('slide-small', 300, 220, true);
    // add_image_size('slide-large', 710, 480, true);
}

// -------
// -------
// -------
// ALLOW SVG
// function cc_mime_types($mimes)
// {
//     $mimes['svg'] = 'image/svg+xml';
//     return $mimes;
// }
// add_filter('upload_mimes', 'cc_mime_types');
// function bodhi_svgs_disable_real_mime_check($data, $file, $filename, $mimes)
// {
//     $wp_filetype = wp_check_filetype($filename, $mimes);
//
//     $ext = $wp_filetype['ext'];
//     $type = $wp_filetype['type'];
//     $proper_filename = $data['proper_filename'];
//
//     return compact('ext', 'type', 'proper_filename');
// }
// add_filter('wp_check_filetype_and_ext', 'bodhi_svgs_disable_real_mime_check', 10, 4);

// -------
// -------
// -------
// FILTER P-TAGS ON IMG
// function filter_ptags_on_images($content)
// {
//     return preg_replace('/<p>(\s*)(<img .* \/>)(\s*)<\/p>/iU', '\2', $content);
// }
//
// add_filter('acf_the_content', 'filter_ptags_on_images');

// -------
// -------
// -------
// WRAP IFRAMES IN DIV
// function div_wrapper($content)
// {
//     // match any iframes
//     $pattern = '~<iframe.*</iframe>|<embed.*</embed>~';
//     preg_match_all($pattern, $content, $matches);
//
//     if (is_array($matches[0])) {
//         foreach ($matches[0] as $match) {
//             // wrap matched iframe with div
//         $wrappedframe = '<div class="embed-responsive">' . $match . '</div>';
//
//         //replace original iframe with new in content
//         $content = str_replace($match, $wrappedframe, $content);
//         }
//     }
//
//     return $content;
// }
// add_filter('the_content', 'div_wrapper');

// -------
// -------
// -------
// REMOVE WIDTH/HEIGHT FROM IMAGES
// function remove_width_attribute($html)
// {
//     $html = preg_replace('/(width|height)="\d*"\s/', "", $html);
//     return $html;
// }
// add_filter('post_thumbnail_html', 'remove_width_attribute', 10);
// add_filter('image_send_to_editor', 'remove_width_attribute', 10);

// -------
// -------
// -------
// CUSTOM COLUMNS
// function my_page_columns($columns)
// {
//     $columns = array(
//         'cb'        => '<input type="checkbox" />',
//         'Image'    =>    'Image',
//         'title'    => 'Title',
//         'categories'    =>    'Categories',
//     );
//     return $columns;
// }
// function my_custom_columns($column)
// {
//     global $post;
//     if ($column == 'Image') {
//         $image = get_field('mosaic_image', $post->ID);
//         echo $image;
//     }
// }
// add_action("manage_posts_custom_column", "my_custom_columns");
// add_filter("manage_edit-post_columns", "my_page_columns");

// -------
// -------
// -------
// REST API
//
//  function prefix_get_post($request)
//  {
//      $id = $request['id'];
//      $likes = get_field('likes', $id) + 1;
//      update_field('likes', $likes, $id);
//      return rest_ensure_response($id);
//  }
//
//  function prefix_get_post_arguments()
//  {
//      $args = array();
//      $args['id'] = array(
//      'description' => esc_html__('Post id', 'my-text-domain'),
//      'type'        => 'string'
//    );
//      return $args;
//  }
//
// function prefix_register_example_routes()
// {
//     register_rest_route('like/v1', '/add', array(
//       'methods'  => WP_REST_Server::CREATABLE,
//       'callback' => 'prefix_get_post',
//       'args' => prefix_get_post_arguments()
//   ));
// }
//
// add_action('rest_api_init', 'prefix_register_example_routes');
// add_filter('rest_allow_anonymous_comments', '__return_true');

// -------
// -------
// -------
// ADD EDITOR STYLES
// add_editor_style();

// -------
// -------
// -------
// CUSTOM POST TYPE: item
function item_post_type()
{
    register_post_type('item',
    array(
      'labels' => array(
        'name' => __('Item'),
        'singular_name' => __('Item')
      ),
      'public' => true,
      'show_in_rest' => true,
      'has_archive' => true,
    )
  );
}
add_action('init', 'item_post_type');

// -------
// -------
// -------
// CUSTOM POST TYPE: text
function text_post_type()
{
    register_post_type('text',
    array(
      'labels' => array(
        'name' => __('Text'),
        'singular_name' => __('Text')
      ),
      'public' => true,
      'show_in_rest' => true,
      'has_archive' => true,
    )
  );
}
add_action('init', 'text_post_type');

// -------
// -------
// -------
// CUSTOM TAXONOMY: collection
function create_collection_tax()
{
    register_taxonomy(
        'collection',
        'item',
        array(
            'label' => __('Collection'),
            'rewrite' => array( 'slug' => 'collection' ),
            'hierarchical' => true,
            'show_in_rest' => true
        )
    );
}
add_action('init', 'create_collection_tax');

// -------
// -------
// -------
// CUSTOM TAXONOMY: tags
function create_tags()
{
    register_taxonomy(
        'tag',
        'item',
        array(
            'label' => __('Tag'),
            'rewrite' => array( 'slug' => 'tag' ),
            'hierarchical' => false,
            'show_in_rest' => true
        )
    );
}
add_action('init', 'create_tags');

// -------
// -------
// -------
// CUSTOMIZE EDITOR
// add_filter('acf/fields/wysiwyg/toolbars', 'my_toolbars');
// function my_toolbars($toolbars)
// {
//     $toolbars['Full' ] = array();
//     $toolbars['Full' ][1] = array('bold', 'italic', 'link', 'unlink');
//
//     // remove the 'Basic' toolbar completely
//     unset($toolbars['Basic' ]);
//
//     // return $toolbars - IMPORTANT!
//     return $toolbars;
// }

// add_action('init', 'pwr_buttons');
// function pwr_buttons()
// {
//     add_filter("mce_external_plugins", "pwr_add_buttons");
//     add_filter('mce_buttons', 'pwr_register_buttons');
// }
// function pwr_add_button($plugin_array)
// {
//     $plugin_array['wptuts'] = get_template_directory_uri() . '/pwr_buttons.js';
//     return $plugin_array;
// }
// function collection_link_buttons($buttons)
// {
//     array_push($buttons, 'collection', 'text');
//     return $buttons;
// }
