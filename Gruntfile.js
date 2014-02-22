module.exports = function(grunt) {
  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './builds',
        mac_icns: './src/resource/icon512x512.icns',
        mac: true, 
        win: true, 
        linux32: false, 
        linux64: false
      },
      src: ['./src/**/*'] 
    },
  });
  
  grunt.loadNpmTasks('grunt-node-webkit-builder');
}