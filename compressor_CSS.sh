#/bin/sh

COMPRESSOR_PATH=/Applications/MAMP/htdocs/sites
COMPRESSOR_BUILDER=yuicompressor-2.4.8.jar

FILE_YUI=/public/css/min/MusicBox.min.css
FILE_DEBUG=/public/css/min/MusicBox.min-debug.css

echo "-------------------------------------------------------------------------"
echo "Compressing SITEWIDE Stylesheet files"
echo "-------------------------------------------------------------------------"
echo 
stylefiles[0]=$PWD/public/css/my-foundation/foundation.css
stylefiles[1]=$PWD/public/css/logo.css
stylefiles[2]=$PWD/public/css/commons.css
stylefiles[3]=$PWD/public/css/doc.css
stylefiles[4]=$PWD/public/css/charset.css
stylefiles[5]=$PWD/public/css/editor.css
stylefiles[6]=$PWD/public/css/media.css

#stylefiles[7]=$PWD/public/css/custom.css

for (( i = 0 ; i < ${#stylefiles[@]} ; i++ ))
do
	echo "File [$i]		${stylefiles[$i]}";
	if [ "$i" == "0" ]; then
		java -jar $COMPRESSOR_PATH/$COMPRESSOR_BUILDER --type css ${stylefiles[$i]} > $PWD/$FILE_YUI
		cat ${stylefiles[$i]} > $PWD/$FILE_DEBUG
	else
		java -jar $COMPRESSOR_PATH/$COMPRESSOR_BUILDER --type css ${stylefiles[$i]} >> $PWD/$FILE_YUI
		cat ${stylefiles[$i]} >> $PWD/$FILE_DEBUG
		
	fi
done;

echo 
echo "-------------------------------------------------------------------------"
echo "Done. Report and file size" 
echo "Combined [$FILE_YUI]	: " $(ls -lah $PWD/$FILE_YUI | awk '{ print $5}')
echo "Debug [$FILE_DEBUG]		: " $(ls -lah $PWD/$FILE_DEBUG | awk '{ print $5}')
echo "-------------------------------------------------------------------------"