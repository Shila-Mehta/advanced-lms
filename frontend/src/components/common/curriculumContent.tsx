 import {BookOpen,Clock,FileText} from "lucide-react";
 import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

 
 export const CurriculumContent = ({ lessons }: { lessons: any }) => {
  // Safe data normalization
  const safeLessons = Array.isArray(lessons) ? lessons : [];
  
  if (safeLessons.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h4 className="text-lg font-semibold mb-2">Curriculum Coming Soon</h4>
        <p className="text-sm">We're working on the course content.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {safeLessons.map((lesson: any, index: number) => {
        // Extremely safe data extraction
        const lessonTitle = lesson?.title || `Lesson ${index + 1}`;
        const lessonDescription = lesson?.description || 'Description not available';
        const lessonDuration = Number(lesson?.duration) || 0;
        const lessonId = lesson?.id || lesson?._id || `lesson-${index}`;

        return (
          <AccordionItem
            key={lessonId}
            value={lessonId}
            className="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 data-[state=open]:shadow-lg"
          >
            <AccordionTrigger className="text-lg font-semibold p-6 hover:no-underline hover:bg-gray-50 rounded-lg transition-all duration-300">
              <div className="flex items-center gap-4 w-full">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 text-left">
                  <span className="font-semibold">{lessonTitle}</span>
                  {lessonDuration > 0 && (
                    <Badge variant="outline" className="ml-3">
                      {lessonDuration} min
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="text-gray-600 mb-4">{lessonDescription}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{lessonDuration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{lesson?.type || 'Video'}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};